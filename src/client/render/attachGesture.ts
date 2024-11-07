import { System } from '../../system'
import { Unlisten } from '../../types/Unlisten'
import { namespaceURI } from '../component/namespaceURI'
import { _addEventListener } from '../event'
import { UnitPointerEvent } from '../event/pointer'
import { catmullRomSplineSegment } from '../util/geometry'
import { Point } from '../util/geometry/types'

function pathFromSpline(stroke: number[][]): string {
  if (!stroke.length) {
    return ''
  }

  let d = `M ${stroke[0][0]} ${stroke[0][1]}`

  for (let i = 1; i < stroke.length; i++) {
    d = d + ` L ${stroke[i][0]} ${stroke[i][1]}`
  }

  return d
}

const STROKE_OPT = {
  size: 3,
  smoothing: 0.99,
  thinning: 0.5,
  streamline: 0.25,
  easing: (t) => t,
  start: {
    taper: 0,
    cap: true,
  },
  end: {
    taper: 0,
    cap: true,
  },
}

export function attachGesture(system: System): void {
  // console.log('attachGesture')

  const {
    root,
    foreground: { svg },
    api: {
      document: { createElementNS },
    },
  } = system

  const captureGesture = (
    event: UnitPointerEvent,
    opt: {
      lineWidth?: number
      strokeStyle?: string
    } = {},
    callback: (event: PointerEvent, track: Point[]) => void
  ): Unlisten => {
    const { pointerId, pageX, pageY } = event

    const path = createElementNS(namespaceURI, 'path')

    svg.appendChild(path)

    const { lineWidth = 10, strokeStyle = '#d1d1d1' } = opt

    const color = strokeStyle

    path.style.stroke = color
    path.style.strokeWidth = `${lineWidth}px`
    path.style.fill = 'none'
    path.style.strokeLinecap = 'round'

    let active = true

    const track: Point[] = [{ x: pageX, y: pageY }]

    let d = ''

    const pointerMoveListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerMoveListener')

      const { pointerId: _pointerId } = _event

      if (_pointerId === pointerId) {
        const { pageX, pageY } = _event

        track.push({ x: pageX, y: pageY })

        if (track.length > 3) {
          const segment = catmullRomSplineSegment(track.slice(-4))

          d += pathFromSpline(segment)
        }

        path.setAttribute('d', d)
      }
    }

    const pointerUpListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerUpListener')

      const { pointerId: _pointerId } = _event

      if (_pointerId === pointerId) {
        unlisten()

        callback(_event, track)
      }
    }

    const unlisten = () => {
      if (active) {
        active = false

        unlistenPointerMove()
        unlistenPointerUp()

        svg.removeChild(path)
      }
    }

    const unlistenPointerMove = _addEventListener(
      'pointermove',
      root.shadowRoot,
      pointerMoveListener,
      true
    )
    const unlistenPointerUp = _addEventListener(
      'pointerup',
      root.shadowRoot,
      pointerUpListener,
      true
    )

    return unlisten
  }

  system.captureGesture = captureGesture
}
