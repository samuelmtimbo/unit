import { IOPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerEnterListener(
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerEnter(component, listener, _global)
  }
}

export function listenPointerEnter(
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerenter', component, listener, _global)
}
