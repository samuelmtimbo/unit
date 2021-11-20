import { IOPointerEvent, listenPointerEvent } from '.'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerUpListener(
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerUp(component, listener, _global)
  }
}

export function listenPointerUp(
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerup', component, listener, _global)
}
