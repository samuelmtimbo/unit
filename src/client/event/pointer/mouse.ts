import { UnitPointerEvent, listenPointerEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'

export function makeMouseLeaveListener(
  listener: (event: UnitPointerEvent, _event?: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenMouseLeave(component, listener, _global)
  }
}

export function listenMouseLeave(
  component: Listenable,
  listener: (event: UnitPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('mouseleave', component, listener, _global)
}
