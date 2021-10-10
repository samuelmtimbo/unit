import { System } from '../../boot'
import { clearCanvas } from '../../system/platform/component/canvas/Canvas/Component'
import { _addEventListener } from '../event'
import { IOPointerEvent } from '../event/pointer'
import { Point } from '../util/geometry'

export function attachGesture($system: System): void {
  // console.log('attachGesture')
  const {
    $root,
    $foreground: { $canvas },
  } = $system

  const context = $canvas.getContext('2d')!

  const captureGesture = (
    event: IOPointerEvent,
    opt: {
      lineWidth?: number
      strokeStyle?: string
    } = {},
    callback: (event: PointerEvent, track: Point[]) => void
  ): void => {
    const { pointerId, screenX, screenY } = event

    // AD HOC

    // $root.setPointerCapture(pointerId)

    $system.$flag.__POINTER__CAPTURE__[pointerId] = $root

    const { lineWidth = 2, strokeStyle = '#d1d1d1' } = opt

    context.lineWidth = lineWidth
    context.strokeStyle = strokeStyle

    context.beginPath()
    context.moveTo(Math.floor(screenX), Math.floor(screenY))

    const track: Point[] = [{ x: screenX, y: screenY }]

    const pointerMoveListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerMoveListener')
      const { pointerId: _pointerId } = _event
      if (_pointerId === pointerId) {
        const { clientX, clientY } = _event

        // const last = track[track.length - 1]
        // const xc = (last.x + clientX) / 2
        // const yc = (last.y + clientY) / 2
        // context.quadraticCurveTo(last.x, last.y, xc, yc)
        context.lineTo(Math.floor(clientX), Math.floor(clientY))
        context.stroke()

        track.push({ x: clientX, y: clientY })
      }
    }
    // const pointerUpListener = (_event: CustomEvent<PointerEvent>) => {
    const pointerUpListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerUpListener')
      const { pointerId: _pointerId } = _event
      if (_pointerId === pointerId) {
        clearCanvas(context)

        // $root.releasePointerCapture(pointerId)
        delete $system.$flag.__POINTER__CAPTURE__[pointerId]

        // $root.removeEventListener('pointermove', pointerMoveListener)
        // $root.removeEventListener('pointerup', pointerUpListener)

        unlistenPointerMove()
        unlistenPointerUp()

        callback(_event, track)
      }
    }

    const unlistenPointerMove = _addEventListener(
      'pointermove',
      $root,
      pointerMoveListener,
      true
    )
    const unlistenPointerUp = _addEventListener(
      'pointerup',
      $root,
      pointerUpListener,
      true
    )

    // $root.addEventListener('pointermove', pointerMoveListener)
    // $root.addEventListener('pointerup', pointerUpListener)
  }

  $system.$method.captureGesture = captureGesture
}
