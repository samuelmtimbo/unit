import { System } from '../../system'
import resizeWith from '../resizeWith'

export function attachCanvas(system: System): void {
  const {
    root,
    api: {
      document: { createElement },
    },
  } = system

  const canvas = createElement('canvas')
  canvas.classList.add('__SYSTEM__CANVAS__')

  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '1'

  resizeWith(system, canvas, root)

  root.shadowRoot.appendChild(canvas)

  system.foreground.canvas = canvas
}
