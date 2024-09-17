import { Component } from './component'

export function isCanvasLike(leaf_comp: Component): boolean {
  return leaf_comp.$element instanceof HTMLCanvasElement
}
