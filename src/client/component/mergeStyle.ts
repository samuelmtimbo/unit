import { Dict } from '../../types/Dict'
import { Component } from '../component'

export function mergePropStyle<
  T extends HTMLElement | SVGElement,
  P extends { style?: Dict<string> },
>(component: Component<T, P>, style: Dict<string>) {
  const current = component.getProp('style')

  component.setProp('style', { ...current, ...style })
}
