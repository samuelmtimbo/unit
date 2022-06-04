import Listenable from '../../Listenable'
import { Listener } from '../../Listener'
import { IOPointerEvent } from '../pointer'

export type IODragLeaveEvent = IOPointerEvent

export function makeDragLeaveListener(
  listener: (event: IODragLeaveEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragLeave(component, listener)
  }
}

export function listenDragLeave(
  component: Listenable,
  listener: (event: IODragLeaveEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragLeaveListener = (_event: CustomEvent<IODragLeaveEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('_dragleave', dragLeaveListener, _global)
  return () => {
    $element.removeEventListener('_dragleave', dragLeaveListener, _global)
  }
}
