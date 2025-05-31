import { Graph } from '../Class/Graph'
import { ChildOutOfBound } from '../exception/ChildOutOfBoundError'
import { evaluateDataValue } from '../spec/evaluateDataValue'
import { resolveDataRef } from '../spec/resolveDataValue'
import { Dict } from '../types/Dict'
import { AnimationSpec } from '../types/interface/C'
import { Component_ } from '../types/interface/Component'
import { UnitBundle } from '../types/UnitBundle'
import { Unlisten } from '../types/Unlisten'
import { insert, push, remove } from '../util/array'

function _appendChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>
): [number, Component_] {
  return pushChild(component, children, Class)
}

export function appendChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>,
  emit: boolean = true
): number {
  const [i, child] = _appendChild(component, children, Class)

  const { __bundle } = Class

  emit && component.emit('append_child', __bundle, child, [])

  return i
}

export function appendChildren(
  component: Component_,
  children: Component_[],
  Classes: UnitBundle<Component_>[]
): number {
  for (const Class of Classes) {
    _appendChild(component, children, Class)
  }

  const bundles = Classes.map((c) => c.__bundle)

  component.emit('append_children', bundles, [])

  return children.length
}

export function instanceChild(
  component,
  Class: UnitBundle<Component_>
): Component_ {
  const system = component.__system

  const unit = new Class(system)

  const {
    input = {},
    output = {},
    memory = { input: {}, output: {}, memory: {} },
  } = Class.__bundle.unit

  for (const name in input) {
    const { data } = input[name]

    if (data !== undefined) {
      const dataRef = evaluateDataValue(data, system.specs, system.classes)

      const data_ = resolveDataRef(dataRef, system.specs, system.classes)

      unit.pushInput(name, data_)
    }
  }

  // unit.restore(memory)

  if (component.paused() && !unit.paused()) {
    unit.pause()
  } else if (!component.paused() && unit.paused()) {
    unit.play()
  }

  return unit
}

export function pushChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>
): [number, Component_] {
  const child = instanceChild(component, Class)

  children.push(child)

  const i = children.length - 1

  return [i, child]
}

export function insertChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>,
  at: number
): void {
  const unit = instanceChild(component, Class)

  insert(children, unit, at)

  const { __bundle: bundle } = Class

  component.emit('insert_child', bundle, at, [])
}

export function hasChild(
  element: Component_,
  children: Component_[],
  at: number
): boolean {
  const has = at >= 0 && at < children.length
  return has
}

export function pullChild(
  element: Component_,
  children: Component_[],
  at: number
): Component_ {
  const has = hasChild(element, children, at)

  if (!has) {
    throw new ChildOutOfBound()
  }

  const [unit] = children.splice(at, 1)

  return unit
}

export function removeChild(
  element: Component_,
  children: Component_[],
  at: number,
  emit: boolean = true
): Component_ {
  const child = pullChild(element, children, at)

  emit && element.emit('remove_child', at, [])
  emit && element.emit(`remove_child_at_${at}`, at)

  return child
}

export function refRoot(
  element: Component_,
  root: Component_[],
  at: number
): Component_ {
  return root[at]
}

export function refChild(
  element: Component_,
  children: Component_[],
  at: number
): Component_ {
  return children[at]
}

export function refChildren(
  element: Component_,
  children: Component_[]
): Component_[] {
  return children
}

export function refSlot(
  element: Graph,
  slotName: string,
  slot: Dict<string>
): Component_ {
  const subComponentId = slot[slotName]

  if (subComponentId) {
    return element.getSubComponent(subComponentId)
  } else {
    return element
  }
}

export function registerParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  slotName: string,
  at: number = undefined,
  emit: boolean = true
): void {
  if (at === undefined) {
    push(parentRoot, child)
  } else {
    insert(parentRoot, child, at)
  }

  const slot = component.refSlot(slotName)

  slot.appendParentChild(component, 'default')

  emit && component.emit('register_parent_root', child, slotName)
}

export function unregisterParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  emit: boolean
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  emit && component.emit('unregister_parent_root', component)
}

export function reorderRoot(
  component: Component_,
  root: Component_[],
  child: Component_,
  to: number,
  emit: boolean
): void {
  const currentIndex = root.indexOf(child)

  if (currentIndex === -1) {
    throw new Error('root not found')
  }

  root.splice(currentIndex, 1)

  insert(root, child, to)

  emit && component.emit('reorder_root', component, to)
}

export function reorderParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  to: number,
  emit: boolean
): void {
  const currentIndex = parentRoot.indexOf(child)

  if (currentIndex === -1) {
    throw new Error('root not found')
  }

  parentRoot.splice(currentIndex, 1)

  insert(parentRoot, child, to)

  emit && component.emit('reorder_parent_root', component, to)
}

export function unregisterRoot(
  component: Component_,
  root: Component_[],
  child: Component_,
  emit: boolean
): void {
  const at = root.indexOf(child)

  root.splice(at, 1)

  emit && component.emit('unregister_root', child)
}

export function registerRoot(
  component: Component_,
  root: Component_[],
  child: Component_,
  emit: boolean
): void {
  root.push(child)

  emit && component.emit('register_root', child)
}

export function appendParentChild(
  component: Component_,
  parentChild: Component_[],
  child: Component_,
  slotName: string,
  emit: boolean
): void {
  const slot = component.refSlot(slotName)

  if (component === slot) {
    parentChild.push(child)

    emit && component.emit('append_parent_child', component, slotName)
  } else {
    slot.appendParentChild(child, 'default', emit)
  }
}

export function removeParentChild(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  emit: boolean
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  emit && component.emit('remove_parent_child', component)
}

export function animate(
  component: Component_,
  animations: AnimationSpec[],
  keyframes: Keyframe[],
  opt: KeyframeAnimationOptions
) {
  animations.push({ keyframes, opt })

  component.emit('call', {
    method: 'animate',
    data: [keyframes, opt],
  })
}

export function cancelAnimation(
  component: Component_,
  animations: AnimationSpec[],
  id: string
) {
  const i = animations.findIndex((animation) => {
    return animation.opt.id === id
  })

  animations.splice(i, 1)

  component.emit('call', {
    method: 'cancelAnimation',
    data: [id],
  })
}

export function stopPropagation(
  component: Component_,
  stopPropagationCount: Dict<number>,
  name: string
): Unlisten {
  stopPropagationCount[name] = stopPropagationCount[name] ?? 0
  stopPropagationCount[name]++

  if (stopPropagationCount[name] === 1) {
    component.emit('call', { method: 'stopPropagation', data: [name] })
  }

  return () => {
    stopPropagationCount[name]--

    if (stopPropagationCount[name] === 0) {
      delete stopPropagationCount[name]

      component.emit('call', { method: 'cancelStopPropagation', data: [name] })
    }
  }
}

export function attachText(
  component: Component_,
  attachTextArray: [string, string][],
  type: string,
  text: string
): Unlisten {
  const entry = [type, text]

  push(attachTextArray, entry)

  if (attachTextArray.length === 1) {
    component.emit('call', { method: 'attachText', data: [type, text] })
  }

  return () => {
    remove(attachTextArray, entry)

    if (attachTextArray.length === 0) {
      component.emit('call', { method: 'detachText', data: [name] })
    }
  }
}

export function attachDropTarget(
  component: Component_,
  attachTextDropTargetArray: [][]
): Unlisten {
  const entry = []

  push(attachTextDropTargetArray, entry)

  if (attachTextDropTargetArray)
    component.emit('call', { method: 'attachDropTarget', data: [] })

  return () => {
    remove(attachTextDropTargetArray, entry)

    if (attachTextDropTargetArray.length === 0) {
      component.emit('call', { method: 'detachDropTarget', data: [] })
    }
  }
}
