import { IOTouchEvent } from '.'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'

export function makeTouchEndListener(
  listener: (event: IOTouchEvent, _event: TouchEvent) => void
): Listener {
  return (component) => {
    return listenTouchEnd(component, listener)
  }
}

export function listenTouchEnd(
  component: Listenable,
  listener: (event: IOTouchEvent, _event: TouchEvent) => void
): () => void {
  const { $element } = component

  const touchEndListener = (_event: TouchEvent) => {
    // log('touchend')
    const { $context } = component
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

  $element.addEventListener('touchend', touchEndListener, { passive: false })
  return () => {
    $element.removeEventListener('touchend', touchEndListener)
  }
}
