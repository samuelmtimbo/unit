import { IODragEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDragOverListener(
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragOver(component, listener, _global)
  }
}

export function listenDragOver(
  component: Listenable,
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragOverListener = (_event: DragEvent) => {
    const { $context } = component

    const event: IODragEvent = {
      ...applyContextTransformToPointerEvent($context, _event),
      dataTransfer: null,
    }

    listener(event, _event)
  }
  $element.addEventListener('dragover', dragOverListener, _global)
  return () => {
    $element.removeEventListener('dragover', dragOverListener, _global)
  }
}
