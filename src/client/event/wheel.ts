import Listenable from '../Listenable'
import { Listener } from '../Listener'

export interface IOWheelEvent {
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  deltaX: number
  deltaY: number
  ctrlKey: boolean
  altKey: boolean
}

export function makeWheelListener(
  listener: (data: IOWheelEvent, _event: WheelEvent) => void
): Listener {
  return (component) => {
    return listenWheel(component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenWheel(
  component: Listenable,
  onWheel: (event: IOWheelEvent, _event: WheelEvent) => void
): () => void {
  const { $element } = component

  const wheelListener = (_event: WheelEvent) => {
    const { $context } = component

    const { $x, $y, $sx, $sy } = $context

    const {
      deltaX,
      deltaY,
      ctrlKey,
      altKey,
      clientX,
      clientY,
      offsetX,
      offsetY,
    } = _event

    onWheel(
      {
        deltaY,
        deltaX,
        ctrlKey,
        altKey,
        clientX: (clientX - $x) / $sx,
        clientY: (clientY - $y) / $sy,
        offsetX,
        offsetY,
      },
      _event
    )
  }

  // $element.addEventListener('wheel', wheelListener, { passive: true })
  $element.addEventListener('wheel', wheelListener, { passive: false })
  return () => {
    $element.removeEventListener('wheel', wheelListener)
  }
}
