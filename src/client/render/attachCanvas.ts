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

  resizeWith(system, canvas, root)

  root.appendChild(canvas)

  system.foreground.canvas = canvas
}
