import { Dict } from '../../types/Dict'
import { Component } from '../component'

export default function mergeProps<T>(
  component: Component<any>,
  props: Dict<any>
) {
  for (const name in props) {
    const prop = props[name]
    component.setProp(name, prop)
  }
}
