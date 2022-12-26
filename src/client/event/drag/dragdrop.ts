import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { IOPointerEvent } from '../pointer'

export type IODragDropEvent = IOPointerEvent & { data: any }

export function makeDragDropListener(
  listener: (event: IODragDropEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragDrop(component, listener, _global)
  }
}

export function listenDragDrop(
  component: Listenable,
  listener: (event: IODragDropEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragOverListener = (_event: CustomEvent<IODragDropEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('_dragdrop', dragOverListener, _global)
  return () => {
    $element.removeEventListener('_dragdrop', dragOverListener, _global)
  }
}
