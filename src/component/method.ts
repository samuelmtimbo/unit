import { ChildOutOfBound } from '../exception/ChildOutOfBound'
import { C } from '../interface/C'
import { C_U } from '../interface/C_U'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'

export function appendChild(
  component: C_U,
  children: C_U[],
  Class: UnitClass<C_U>
): number {
  const i = pushChild(component, children, Class)

  const id = Class.id

  component.emit('append_child', { id })

  component.emit('leaf_append_child', { id, path: [] })

  return i
}

export function pushChild(
  component: C_U,
  children: C_U[],
  Class: UnitClass<C_U>
): number {
  const unit = new Class({})

  children.push(unit)

  if (component.paused() && !unit.paused()) {
    unit.pause()
  } else if (!component.paused() && unit.paused()) {
    unit.play()
  }

  const i = children.length - 1

  return i
}

export function hasChild(element: C, children: C[], at: number): boolean {
  const has = at >= 0 && at < children.length
  return has
}

export function pullChild(
  element: C,
  children: C[],
  at: number
): UnitClass<C_U> {
  const has = hasChild(element, children, at)

  if (!has) {
    throw new ChildOutOfBound()
  }

  const unit = children.splice(at, 1)

  const Class = unit.constructor as UnitClass<C_U>

  return Class
}

export function removeChild(
  element: C_U,
  children: C_U[],
  at: number
): UnitClass<C_U> {
  const Class = pullChild(element, children, at)

  element.emit('remove_child_at', { at })

  element.emit(`remove_child_at_${at}`)

  element.emit('leaf_remove_child_at', { at, path: [] })

  return Class
}

export function refChild(element: C_U, children: C_U[], at: number): C {
  return children[at]
}

export function refChildren(element: C_U, children: C_U[]): C_U[] {
  return children
}

export function refSlot(element: C_U, slotName: string, slot: Dict<C>): C {
  return slot[slotName] || element
}

export function registerParentRoot(
  component: C,
  parentRoot: C[],
  child: C,
  slotName: string
): void {
  parentRoot.push(child)

  component.emit('register_parent_root', child, slotName)

  const slot = component.refSlot(slotName)

  slot.appendParentChild(component, 'default')
}

export function unregisterParentRoot(
  component: C,
  parentRoot: C[],
  child: C
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('unregister_parent_root', component)
}

export function unregisterRoot(component: C, root: C[], child: C): void {
  const at = root.indexOf(child)

  root.splice(at, 1)

  component.emit('unregister_root', component)
}

export function registerRoot(component: C, root: C[], child: C): number {
  root.push(child)

  component.emit('register_root', component)

  return root.length - 1
}

export function appendParentChild(
  component: C,
  parentChild: C[],
  child: C,
  slotName: string
): void {
  const slot = component.refSlot(slotName)

  if (component === slot) {
    parentChild.push(child)

    component.emit('append_parent_child', component)
  } else {
    slot.appendParentChild(child, 'default')
  }
}

export function removeParentChild(
  component: C,
  parentRoot: C[],
  child: C
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('remove_parent_child', component)
}
