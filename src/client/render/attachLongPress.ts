import { System } from '../../boot'
import namespaceURI from '../component/namespaceURI'
import { IOPointerEvent } from '../event/pointer'

const LONG_PRESS_DURATION = 0.2
const LONG_PRESS_TRANSITION = `r ${LONG_PRESS_DURATION}s linear, opacity ${LONG_PRESS_DURATION}s linear`
const LONG_PRESS_RADIUS = 90

export function attachLongPress($system: System): void {
  const { $foreground } = $system

  const { $svg } = $foreground

  const { innerWidth, innerHeight } = window
  const cx = innerWidth / 2
  const cy = innerHeight / 2

  const long_press = document.createElementNS(namespaceURI, 'circle')
  long_press.style.display = 'block'
  long_press.style.strokeWidth = '2px'
  long_press.style.fill = 'none'
  long_press.style.opacity = '0'
  long_press.setAttribute('cx', `${cx}`)
  long_press.setAttribute('cy', `${cy}`)
  long_press.style.pointerEvents = 'none'
  long_press.setAttribute('r', `${LONG_PRESS_RADIUS}`)

  $svg.appendChild(long_press)

  const showLongPress = (
    event: IOPointerEvent,
    opt: {
      stroke?: string
      direction?: 'in' | 'out'
    } = {}
  ) => {
    // console.log('showLongPress')
    const { screenX, screenY } = event

    const { stroke = 'currentColor', direction = 'in' } = opt

    long_press.style.stroke = stroke
    long_press.setAttribute('cx', `${screenX}`)
    long_press.setAttribute('cy', `${screenY}`)
    long_press.style.transition = ''
    if (direction === 'in') {
      long_press.style.opacity = '0'
      long_press.setAttribute('r', `${LONG_PRESS_RADIUS}`)
      setTimeout(() => {
        long_press.style.transition = LONG_PRESS_TRANSITION
        long_press.style.opacity = '1'
        long_press.setAttribute('r', `${0}`)
      }, 10)
    } else {
      long_press.style.opacity = '1'
      long_press.setAttribute('r', `0`)
      setTimeout(() => {
        long_press.style.transition = LONG_PRESS_TRANSITION
        long_press.style.opacity = '0'
        long_press.setAttribute('r', `${LONG_PRESS_RADIUS}`)
      }, 10)
    }
  }

  $system.$method.showLongPress = showLongPress
}
