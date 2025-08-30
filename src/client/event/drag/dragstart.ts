import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { UnitMouseEvent, applyContextTransformToPointerEvent } from '../pointer'

export type UnitDragStartEvent = UnitMouseEvent

export function makeDragStartListener(
  listener: (event: UnitDragStartEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragStart(component, listener, _global)
  }
}

export function listenDragStart(
  component: Listenable,
  listener: (event: UnitDragStartEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragStartListener = (_event: DragEvent) => {
    const { $context } = component

    const event = applyContextTransformToPointerEvent($context, _event)

    listener(event, _event)
  }
  $element.addEventListener('dragstart', dragStartListener, _global)
  return () => {
    $element.removeEventListener('dragstart', dragStartListener, _global)
  }
}
