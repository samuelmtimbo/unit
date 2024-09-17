import { Component } from './component'

export function isTableLike(leaf_comp: Component): boolean {
  return leaf_comp.$element instanceof HTMLTableElement
}
