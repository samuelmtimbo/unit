import { System } from '../system'
import { Component } from './component'

export function isSVGLike(leaf_comp: Component): boolean {
  return leaf_comp.isSVG()
}

export function isSVG(system: System, element: Node): boolean {
  const {
    api: {
      window: { SVGElement, SVGSVGElement },
    },
  } = system

  return element instanceof SVGElement && !(element instanceof SVGSVGElement)
}

export function isSVGSVG(system: System, element: Node): boolean {
  const {
    api: {
      window: { SVGSVGElement },
    },
  } = system

  return element instanceof SVGSVGElement
}
