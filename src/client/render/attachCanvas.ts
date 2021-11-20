import { System } from '../../system'
import resizeWith from '../resizeWith'

export function attachCanvas($system: System): void {
  const { root: $root } = $system

  const canvas = document.createElement('canvas')
  canvas.classList.add('__SYSTEM__CANVAS__')
  canvas.style.pointerEvents = 'none'

  resizeWith(canvas, $root)

  $root.appendChild(canvas)

  $system.foreground.canvas = canvas
}
