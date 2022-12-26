import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { IOPointerEvent } from '../pointer'

export type IODragOverEvent = IOPointerEvent

export function makeDragOverListener(
  listener: (event: IODragOverEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragOver(component, listener, _global)
  }
}

export function listenDragOver(
  component: Listenable,
  listener: (event: IODragOverEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragOverListener = (_event: CustomEvent<IODragOverEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('_dragover', dragOverListener, _global)
  return () => {
    $element.removeEventListener('_dragover', dragOverListener, _global)
  }
}
