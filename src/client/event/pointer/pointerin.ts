import { UnitPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerInListener(
  listener: (event: UnitPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerIn(component, listener, _global)
  }
}

export function listenPointerIn(
  component: Listenable,
  listener: (event: UnitPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerin', component, listener, _global)
}
