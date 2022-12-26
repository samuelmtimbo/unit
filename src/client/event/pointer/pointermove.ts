import { IOPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerMoveListener(
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerMove(component, listener, _global)
  }
}

export function listenPointerMove(
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointermove', component, listener, _global)
}
