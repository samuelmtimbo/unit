import { UnitPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerCancelListener(
  listener: (event: UnitPointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerCancel(component, listener, _global)
  }
}

export function listenPointerCancel(
  component: Listenable,
  listener: (event: UnitPointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointercancel', component, listener, _global)
}
