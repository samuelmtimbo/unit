import { IODragEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDragLeaveListener(
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragLeave(component, listener)
  }
}

export function listenDragLeave(
  component: Listenable,
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragLeaveListener = (_event: DragEvent) => {
    const { $context } = component

    const event: IODragEvent = {
      ...applyContextTransformToPointerEvent($context, _event),
      dataTransfer: null,
    }

    listener(event, _event)
  }

  $element.addEventListener('dragleave', dragLeaveListener)

  return () => {
    $element.removeEventListener('dragleave', dragLeaveListener)
  }
}
