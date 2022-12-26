import { proxyWrap } from '../proxyWrap'
import { Callback } from '../types/Callback'
import { $Component } from '../types/interface/async/$Component'
import { $EE } from '../types/interface/async/$EE'
import { Async } from '../types/interface/async/Async'
import { Component_ } from '../types/interface/Component'
import { EE } from '../types/interface/EE'
import { W } from '../types/interface/W'
import { UnitBundle } from '../types/UnitBundle'
import { $Child } from './Child'
import { $Children } from './Children'

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
  // XABLEAU
  callback: Callback<$Child>
): void {
  const child = component.refChild(at)
  // @ts-ignore
  const id = child.constructor.id
  callback(id)
}

export function $children(
  component: Component_,
  {},
  callback: Callback<$Children>
): void {
  const children = component.refChildren()

  const _children = children.map((c) => {
    return { bundle: c.getUnitBundleSpec() } as $Child
  })

  callback(_children)
}

export function $refChild(
  component: Component_,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const child = component.refChild(at)
  const $child = Async(child, _)
  return proxyWrap($child, _)
}

export function $refEmitter(emitter: EE): $EE {
  const _emitter = emitter

  const $_emitter = Async(_emitter, ['$EE'])

  return proxyWrap($_emitter, ['$EE'])
}

export function $refChildContainer(
  component: W,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refChildContainer(at)
  const $container = Async(container, _)
  return proxyWrap($container, _)
}

export function $refParentRootContainer(
  component: W,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refParentRootContainer(at)
  const local_child = Async(container, _)
  return proxyWrap(local_child, _)
}

export function $refParentChildContainer(
  component: W,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refParentChildContainer(at)
  const local_child = Async(container, _)
  return proxyWrap(local_child, _)
}
