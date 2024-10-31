import { Callback } from '../types/Callback'
import { $Component } from '../types/interface/async/$Component'
import { Async } from '../types/interface/async/Async'
import { AnimationSpec, C, ComponentSetup } from '../types/interface/C'
import { Component_ } from '../types/interface/Component'
import { UnitBundle } from '../types/UnitBundle'
import { Child } from './Child'
import { Children } from './Children'

export function $appendChild(
  component: Component_,
  Class: UnitBundle<Component_>,
  callback: Callback<number>
): void {
  const i = component.appendChild(Class)

  callback(i)
}

export function $removeChild(
  component: Component_,
  { at }: { at: number },
  callback: Callback<{ specId: string }>
): void {
  try {
    const child = component.removeChild(at)
    const bundle = child.getUnitBundleSpec()
    const specId = bundle.unit.id
    callback({ specId })
  } catch (err) {
    callback(undefined, err.message)
  }
}

export function $hasChild(
  component: Component_,
  { at }: { at: number },
  callback: Callback<boolean>
): void {
  const has = component.hasChild(at)
  callback(has)
}

export function $child(
  component: Component_,
  { at }: { at: number },
  callback: Callback<Child>
): void {
  const child = component.refChild(at)
  // @ts-ignore
  const id = child.constructor.id
  callback(id)
}

export function $children(
  component: Component_,
  {},
  callback: Callback<Children>
): void {
  const children = component.refChildren()

  const _children = children.map((c) => {
    return { bundle: c.getUnitBundleSpec() } as Child
  })

  callback(_children)
}

export function $refRoot(
  component: Component_,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const root = component.refRoot(at)

  const $root = Async(root, _, component.__system.async)

  return $root
}

export function $refChild(
  component: Component_,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const child = component.refChild(at)

  const $child = Async(child, _, component.__system.async)

  return $child
}

export function $getAnimations(
  component: C,
  data: {},
  callback: Callback<AnimationSpec[]>
): void {
  const animations = component.getAnimations()

  callback(animations)
}

export function $getSetup(
  component: C,
  data: {},
  callback: Callback<ComponentSetup>
): void {
  const setup = component.getSetup()

  callback(setup)
}
