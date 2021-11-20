import { _addEventListener } from '..'
import { Unlisten } from '../../../Unlisten'
import { Context } from '../../context'
import Listenable from '../../Listenable'
import { addVector, rotateVector, subtractVector } from '../../util/geometry'

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

export interface IOPointerEvent {
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  screenX: number
  screenY: number
  pointerId: number
  pointerType: string
}

export function _IOPointerEvent(
  $context: Context,
  _event: PointerEvent
): IOPointerEvent {
  const { $x, $y, $sx, $sy, $rz, $width, $height } = $context

  const {
    pointerId,
    pointerType,
    clientX,
    clientY,
    offsetX,
    offsetY,
    screenX,
    screenY,
    target,
  } = _event

  const rz_cos = Math.cos($rz)
  const rz_sin = -Math.sin($rz)

  const _x = (clientX - $x) / $sx
  const _y = (clientY - $y) / $sy

  const cx = ($width * rz_cos - $height * rz_sin) / 2
  const cy = ($width * rz_sin + $height * rz_cos) / 2

  const c = { x: cx, y: cy }

  const p = { x: _x, y: _y }

  const cp = subtractVector(p, c)

  const rcp = rotateVector(cp, -$rz)

  const fp = addVector(c, rcp)

  const x = fp.x
  const y = fp.y

  // const rz_cos = Math.cos($rz)
  // const rz_sin = -Math.sin($rz)

  // const x = _x * rz_cos - _y * rz_sin
  // const y = _x * rz_sin + _y * rz_cos

  return {
    clientX: x,
    clientY: y,
    offsetX,
    offsetY,
    screenX: clientX,
    screenY: clientY,
    // screenX,
    // screenY,
    pointerId,
    pointerType,
  }
}

export function listenPointerEvent(
  type: string,
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Unlisten {
  const { $element } = component
  const pointerEventListener = (_event: PointerEvent) => {
    // log(type)
    const { $context } = component
    const event = _IOPointerEvent($context, _event)
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
