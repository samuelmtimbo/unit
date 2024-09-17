import { Component } from './component'

export function isSVGLike(leaf_comp: Component): boolean {
  return leaf_comp.isSVG()
}
