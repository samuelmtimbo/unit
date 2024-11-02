import { Component } from '../component'

export function toggleProp<T>(
  component: Component<any, any>,
  name: string
) {
  component.setProp(name, !component.getProp(name))
}
