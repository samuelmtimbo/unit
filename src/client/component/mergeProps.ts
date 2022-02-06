import { Dict } from '../../types/Dict'
import { Component } from '../component'

export default function mergeProps<T extends Dict<any>>(
  component: Component<any, T>,
  props: Dict<any>
) {
  for (const name in props) {
    const prop = props[name]
    component.setProp(name, prop)
  }
}
