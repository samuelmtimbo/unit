import { UnitPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerLeaveListener(
  listener: (event: UnitPointerEvent, _event?: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerLeave(component, listener, _global)
  }
}

export function listenPointerLeave(
  component: Listenable,
  listener: (event: UnitPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerleave', component, listener, _global)
}
