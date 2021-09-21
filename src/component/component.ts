import { ChildOutOfBound } from '../exception/ChildOutOfBound'
import { C } from '../interface/C'
import { C_U } from '../interface/C_U'
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

export function child(element: C_U, children: C_U[], at: number): C {
  return children[at]
}

export function children(element: C_U, children: C_U[]): C_U[] {
  return children
}
