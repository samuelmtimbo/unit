import { UnitDragEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDragLeaveListener(
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragLeave(component, listener)
  }
}

export function listenDragLeave(
  component: Listenable,
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragLeaveListener = (_event: DragEvent) => {
    const { $context } = component

    const event: UnitDragEvent = {
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
