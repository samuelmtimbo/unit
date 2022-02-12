import { getStroke } from 'perfect-freehand'
import { System } from '../../system'
import namespaceURI from '../component/namespaceURI'
import { _addEventListener } from '../event'
import { IOPointerEvent } from '../event/pointer'
import { Point } from '../util/geometry'

function getSvgPathFromStroke(stroke): string {
  if (!stroke.length) {
    return ''
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')

  return d.join(' ')
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
    event: IOPointerEvent,
    opt: {
      lineWidth?: number
      strokeStyle?: string
    } = {},
    callback: (event: PointerEvent, track: Point[]) => void
  ): void => {
    const { pointerId, screenX, screenY } = event

    // $root.setPointerCapture(pointerId)

    system.cache.pointerCapture[pointerId] = root

    const path = createElementNS(namespaceURI, 'path')

    svg.appendChild(path)

    const { lineWidth = 2, strokeStyle = '#d1d1d1' } = opt

    const color = strokeStyle

    path.style.stroke = color
    path.style.strokeWidth = `${lineWidth}px`
    path.style.fill = color

    const track: Point[] = [{ x: screenX, y: screenY }]

    const pointerMoveListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerMoveListener')

      const { pointerId: _pointerId } = _event

      if (_pointerId === pointerId) {
        const { clientX, clientY } = _event

        const outline = getStroke(track, STROKE_OPT)

        const d = getSvgPathFromStroke(outline)

        path.setAttribute('d', d)

        track.push({ x: clientX, y: clientY })
      }
    }

    const pointerUpListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerUpListener')

      const { pointerId: _pointerId } = _event
      if (_pointerId === pointerId) {
        // $root.releasePointerCapture(pointerId)

        delete system.cache.pointerCapture[pointerId]

        svg.removeChild(path)

        unlistenPointerMove()
        unlistenPointerUp()

        callback(_event, track)
      }
    }

    const unlistenPointerMove = _addEventListener(
      'pointermove',
      root,
      pointerMoveListener,
      true
    )
    const unlistenPointerUp = _addEventListener(
      'pointerup',
      root,
      pointerUpListener,
      true
    )
  }

  system.method.captureGesture = captureGesture
}
