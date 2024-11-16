import { System } from '../../../system'
import { Point, Size } from '../geometry/types'

export function measureSVG(
  system: System,
  element: SVGElement,
  clone: boolean = true
): Point & Size {
  const {
    foreground: { svg },
  } = system

  if (clone) {
    element = element.cloneNode(true) as SVGElement

    element.style.visibility = 'hidden'

    svg.appendChild(element)
  }

  const rect = element.getBoundingClientRect()

  const { x, y, width, height } = rect

  if (clone) {
    svg.removeChild(element)
  }

  return {
    x,
    y,
    width,
    height,
  }
}
