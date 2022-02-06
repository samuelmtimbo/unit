import { Component } from './component'

export function component_(component: Component): string[] {
  let _ = ['$EE', '$U', '$C', ...component.$_]
  if (component.$primitive) {
    _ = [..._, '$V', '$J']
  }
  if (component.$unbundled) {
    _ = [..._, '$G']
  }
  return _
}
