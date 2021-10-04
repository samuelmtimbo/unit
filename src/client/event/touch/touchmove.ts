import { IOTouchEvent } from '.'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'

export function makeTouchMoveListener(
  listener: (event: IOTouchEvent, _event: TouchEvent) => void
): Listener {
  return (component) => {
    return listenTouchMove(component, listener)
  }
}

export function listenTouchMove(
  component: Listenable,
  listener: (event: IOTouchEvent, _event: TouchEvent) => void
): () => void {
  const { $element } = component

  const touchMoveListener = (_event: TouchEvent) => {
    const { $context } = component
    // log('touchmove')
    const { $x, $y, $sx, $sy } = $context

    const { changedTouches, touches } = _event

    const event: IOTouchEvent = []

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i] as Touch
      const { clientX, clientY } = touch

      event.push({
        clientX: (clientX - $x) / $sx,
        clientY: (clientY - $y) / $sy,
        screenX: clientX,
        screenY: clientY,
      })
    }

    listener(event, _event)
  }

  $element.addEventListener('touchmove', touchMoveListener)
  return () => {
    $element.removeEventListener('touchmove', touchMoveListener)
  }
}
