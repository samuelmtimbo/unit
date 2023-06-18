import { _addEventListener } from '..'
import { Unlisten } from '../../../types/Unlisten'
import { Context } from '../../context'
import { Listenable } from '../../Listenable'
import { rotateVector } from '../../util/geometry'

export const POINTER_EVENT_NAMES = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'pointercancel',
  'pointerover',
  'pointerout',
]

export interface IOMouseEvent {
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  screenX: number
  screenY: number
}

export interface UnitPointerEvent extends IOMouseEvent {
  pointerId: number
  pointerType: string
}

export const applyContextTransformToPointerEvent = (
  context: Context,
  event: {
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
  }
) => {
  const { $x, $y, $sx, $sy, $rz } = context

  const { clientX, clientY, offsetX, offsetY } = event

  const tx = clientX - $x
  const ty = clientY - $y

  const stx = tx / $sx
  const sty = ty / $sy

  const t = { x: stx, y: sty }

  const fp = rotateVector(t, -$rz)

  const clientX_ = fp.x
  const clientY_ = fp.y

  return {
    clientX: clientX_,
    clientY: clientY_,
    offsetX: t.x,
    offsetY: t.y,
    screenX: clientX,
    screenY: clientY,
    // screenX,
    // screenY,
  }
}

export function makeSyntheticPointerEvent(
  context: Context,
  event: {
    pointerId: number
    pointerType: string
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
  }
): UnitPointerEvent {
  const { pointerId, pointerType } = event

  return {
    ...applyContextTransformToPointerEvent(context, event),
    pointerId,
    pointerType,
  }
}

export function listenPointerEvent(
  type: string,
  component: Listenable,
  listener: (event: UnitPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Unlisten {
  const { $element } = component

  const pointerEventListener = (_event: PointerEvent) => {
    const { $context } = component

    const event = makeSyntheticPointerEvent($context, _event)

    listener(event, _event)
  }

  const unlisten = _addEventListener(
    type,
    $element,
    pointerEventListener,
    _global
  )

  const { $listenCount } = component

  $listenCount[type] = $listenCount[type] || 0
  $listenCount[type]++

  return () => {
    $listenCount[type]--

    if ($listenCount[type] === 0) {
      delete $listenCount[type]
    }
    unlisten()
  }
}
