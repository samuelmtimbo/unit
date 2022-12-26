import { System } from '../../system'
import namespaceURI from '../component/namespaceURI'
import resizeWith from '../resizeWith'

export function attachSVG(system: System): void {
  const {
    root,
    foreground,
    api: {
      document: { createElementNS },
    },
  } = system

  const svg = createElementNS(namespaceURI, 'svg')

  svg.classList.add('__SYSTEM__SVG__')

  svg.style.pointerEvents = 'none'
  svg.style.position = 'absolute'
  svg.style.top = '0'
  svg.style.left = '0'

  resizeWith(system, svg, root)

  root.shadowRoot.appendChild(svg)

  foreground.svg = svg
}
