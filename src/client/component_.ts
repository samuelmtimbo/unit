import { Component } from './component'

export function component_(childSubComponent: Component): string[] {
  let _ = ['$U', '$C', ...childSubComponent.$_]
  if (childSubComponent.$primitive) {
    _ = [..._, '$V', '$J']
  }
  if (childSubComponent.$unbundled) {
    _ = [..._, '$G']
  }
  return _
}
