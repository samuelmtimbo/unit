import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { UnitPointerEvent } from '../pointer'

export type IODragEnterEvent = UnitPointerEvent & { id: string }

export function makeDragEnterListener(
  listener: (event: IODragEnterEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragEnter(component, listener, _global)
  }
}

export function listenDragEnter(
  component: Listenable,
  listener: (event: IODragEnterEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragEnterListener = (_event: CustomEvent<IODragEnterEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('dragenter', dragEnterListener, _global)
  return () => {
    $element.removeEventListener('dragenter', dragEnterListener, _global)
  }
}
