import { UnitDragEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDragEnterListener(
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragEnter(component, listener, _global)
  }
}

export function listenDragEnter(
  component: Listenable,
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragEnterListener = (_event: DragEvent) => {
    const { $context } = component

    const event: UnitDragEvent = {
      ...applyContextTransformToPointerEvent($context, _event),
      dataTransfer: null,
    }

    listener(event, _event)
  }
  $element.addEventListener('dragenter', dragEnterListener, _global)
  return () => {
    $element.removeEventListener('dragenter', dragEnterListener, _global)
  }
}
