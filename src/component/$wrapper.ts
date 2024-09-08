import { $ } from '../Class/$'
import { proxyWrap } from '../proxyWrap'
import { $Component } from '../types/interface/async/$Component'
import { Async } from '../types/interface/async/Async'
import { WP } from '../types/interface/WP'

export function $refChildContainer(
  component: WP & $,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refChildContainer(at)
  const $container = Async(container, _, component.__system.async)
  return proxyWrap($container, _)
}

export function $refParentRootContainer(
  component: WP & $,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refParentRootContainer(at)
  const local_child = Async(container, _, component.__system.async)
  return proxyWrap(local_child, _)
}

export function $refParentChildContainer(
  component: WP & $,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const container = component.refParentChildContainer(at)
  const local_child = Async(container, _, component.__system.async)
  return proxyWrap(local_child, _)
}
