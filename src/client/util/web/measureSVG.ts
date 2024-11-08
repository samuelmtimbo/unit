import { System } from '../../../system'
import { Size } from '../geometry/types'

export function measureSVG(system: System, element: SVGElement): Size {
  const {
    foreground: { svg },
  } = system

  element = element.cloneNode(true) as SVGAElement

  element.style.visibility = 'hidden'

  svg.appendChild(element)

  const rect = element.getBoundingClientRect()

  const { x, y, width, height } = rect

  svg.removeChild(element)

  return {
    width: width + 2 * x,
    height: height + 2 * y,
  }
}
