import { Dict } from '../../types/Dict'
import { Component } from '../component'

export default function mergeStyle<T>(
  component: Component<any, any>,
  style: Dict<string>
) {
  const current = component.getProp('style')
  component.setProp('style', { ...current, ...style })
}
