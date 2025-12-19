import { $ } from '../Class/$'
import { proxyWrap } from '../proxyWrap'
import { $Component } from '../types/interface/async/$Component'
import { Async } from '../types/interface/async/Async'
import { WP } from '../types/interface/WP'

export function $refChildContainer(
  component: WP & $,
  { at, __ }: { at: number; __: string[] }
): $Component {
  const container = component.refChildContainer(at)
  const $container = Async(container, __, component.__system.async)
  return proxyWrap($container, __)
}

export function $refParentRootContainer(
  component: WP & $,
  { at, __ }: { at: number; __: string[] }
): $Component {
  const container = component.refParentRootContainer(at)
  const local_child = Async(container, __, component.__system.async)
  return proxyWrap(local_child, __)
}

export function $refParentChildContainer(
  component: WP & $,
  { at, __ }: { at: number; __: string[] }
): $Component {
  const container = component.refParentChildContainer(at)
  const local_child = Async(container, __, component.__system.async)
  return proxyWrap(local_child, __)
}
