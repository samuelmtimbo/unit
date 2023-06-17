import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { UnitPointerEvent } from '../pointer'

export type IODragEnterEvent = UnitPointerEvent & { id: string }

export function makeDragStartListener(
  listener: (event: IODragEnterEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragStart(component, listener, _global)
  }
}

export function listenDragStart(
  component: Listenable,
  listener: (event: IODragEnterEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragStartListener = (_event: CustomEvent<IODragEnterEvent>) => {
    const { detail } = _event

    listener(detail)
  }
  $element.addEventListener('dragstart', dragStartListener, _global)
  return () => {
    $element.removeEventListener('dragstart', dragStartListener, _global)
  }
}
