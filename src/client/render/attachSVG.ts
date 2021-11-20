import { System } from '../../system'
import namespaceURI from '../component/namespaceURI'
import resizeWith from '../resizeWith'

export function attachSVG($system: System): void {
  const { root: $root, foreground: $foreground } = $system

  const svg = document.createElementNS(namespaceURI, 'svg')

  svg.classList.add('__SYSTEM__SVG__')

  svg.style.pointerEvents = 'none'
  svg.style.position = 'absolute'
  svg.style.top = '0'
  svg.style.left = '0'
  // svg.style.backgroundColor = '#44994488'

  resizeWith(svg, $root)

  $root.appendChild(svg)

  $foreground.svg = svg
}
