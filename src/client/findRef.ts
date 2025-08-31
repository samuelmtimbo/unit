import { Component } from './component'
import { IOElement } from './IOElement'

export function findRef<T extends IOElement = IOElement>(
  component: Component,
  name: string
): Component<T> | null {
  let c: Component | null = component

  while (c) {
    if (c.$ref[name]) {
      return c.$ref[name]
    }

    c = c.$slotParent || c.$domParent
  }

  return null
}
