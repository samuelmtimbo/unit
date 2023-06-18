import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { UnitPointerEvent } from '../pointer'

export type IODragCancelEvent = UnitPointerEvent & { data: any }

export function makeDragCancelListener(
  listener: (event: IODragCancelEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragCancel(component, listener, _global)
  }
}

export function listenDragCancel(
  component: Listenable,
  listener: (event: IODragCancelEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragCancelListener = (_event: CustomEvent<IODragCancelEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('dragcancel', dragCancelListener, _global)
  return () => {
    $element.removeEventListener('dragcancel', dragCancelListener, _global)
  }
}
