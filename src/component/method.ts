import { ChildOutOfBound } from '../exception/ChildOutOfBoundError'
import { Component_ } from '../interface/Component'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'

export function appendChild(
  component: Component_,
  children: Component_[],
  Class: UnitClass<Component_>
): number {
  const i = pushChild(component, children, Class)

  const { __bundle: bundle } = Class

  component.emit('append_child', { bundle })
  component.emit('leaf_append_child', { path: [], bundle })

  return i
}

export function pushChild(
  component: Component_,
  children: Component_[],
  Class: UnitClass<Component_>
): number {
  const system = component.refSystem()
  const pod = component.refPod()

  const unit = new Class(system, pod)

  children.push(unit)

  if (component.paused() && !unit.paused()) {
    unit.pause()
  } else if (!component.paused() && unit.paused()) {
    unit.play()
  }

  const i = children.length - 1

  return i
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
): UnitClass<Component_> {
  const has = hasChild(element, children, at)

  if (!has) {
    throw new ChildOutOfBound()
  }

  const unit = children.splice(at, 1)

  const Class = unit.constructor as UnitClass<Component_>

  return Class
}

export function removeChild(
  element: Component_,
  children: Component_[],
  at: number
): UnitClass<Component_> {
  const Class = pullChild(element, children, at)

  element.emit('remove_child_at', { at })
  element.emit(`remove_child_at_${at}`, { at })
  element.emit('leaf_remove_child_at', { at, path: [] })

  return Class
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
