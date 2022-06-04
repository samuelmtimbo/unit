import { ChildOutOfBound } from '../exception/ChildOutOfBoundError'
import { Dict } from '../types/Dict'
import { Component_ } from '../types/interface/Component'
import { UnitBundle } from '../types/UnitBundle'
import { insert } from '../util/array'

export function appendChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>
): number {
  const i = pushChild(component, children, Class)

  const { __bundle: bundle } = Class

  component.emit('append_child', { bundle })
  component.emit('leaf_append_child', { path: [], bundle })

  return i
}

export function instanceChild(
  component,
  Class: UnitBundle<Component_>
): Component_ {
  const system = component.refSystem()
  const pod = component.refPod()

  const unit = new Class(system, pod)

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
): number {
  const unit = instanceChild(component, Class)

  children.push(unit)

  const i = children.length - 1

  return i
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

  component.emit('insert_child', { bundle, at })
  component.emit('leaf_insert_child', { path: [], bundle, at })
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
  at: number
): Component_ {
  const child = pullChild(element, children, at)

  element.emit('remove_child', { at })
  element.emit(`remove_child_at_${at}`, { at })
  element.emit('leaf_remove_child', { at, path: [] })

  return child
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
  element: Component_,
  slotName: string,
  slot: Dict<Component_>
): Component_ {
  return slot[slotName] || element
}

export function registerParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  slotName: string
): void {
  parentRoot.push(child)

  component.emit('register_parent_root', child, slotName)

  const slot = component.refSlot(slotName)

  slot.appendParentChild(component, 'default')
}

export function unregisterParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('unregister_parent_root', component)
}

export function unregisterRoot(
  component: Component_,
  root: Component_[],
  child: Component_
): void {
  const at = root.indexOf(child)

  root.splice(at, 1)

  component.emit('unregister_root', component)
}

export function registerRoot(
  component: Component_,
  root: Component_[],
  child: Component_
): void {
  root.push(child)

  component.emit('register_root', component)
}

export function appendParentChild(
  component: Component_,
  parentChild: Component_[],
  child: Component_,
  slotName: string
): void {
  const slot = component.refSlot(slotName)

  if (component === slot) {
    parentChild.push(child)

    component.emit('append_parent_child', component, slotName)
  } else {
    slot.appendParentChild(child, 'default')
  }
}

export function removeParentChild(
  component: Component_,
  parentRoot: Component_[],
  child: Component_
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('remove_parent_child', component)
}
