import { UnitDragEvent } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDragCancelListener(
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragCancel(component, listener)
  }
}

export function listenDragCancel(
  component: Listenable,
  listener: (event: UnitDragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragCancelListener = (_event: DragEvent) => {
    const { $context } = component

    const event: UnitDragEvent = {
      ...applyContextTransformToPointerEvent($context, _event),
      dataTransfer: null,
    }

    listener(event, _event)
  }

  $element.addEventListener('dragcancel', dragCancelListener)

  return () => {
    $element.removeEventListener('dragcancel', dragCancelListener)
  }
}
