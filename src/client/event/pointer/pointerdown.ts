import { IOPointerEvent, listenPointerEvent } from '.'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerDownListener(
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerDown(component, listener, _global)
  }
}

export function listenPointerDown(
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerdown', component, listener, _global)
}
