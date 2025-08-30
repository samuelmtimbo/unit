import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { UnitMouseEvent, applyContextTransformToPointerEvent } from '../pointer'

export type UnitDragEndEvent = UnitMouseEvent

export function makeDragEndListener(
  listener: (event: UnitDragEndEvent, _event: Event) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragEnd(component, listener, _global)
  }
}

export function listenDragEnd(
  component: Listenable,
  listener: (event: UnitDragEndEvent, _event: Event) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragStartListener = (_event: DragEvent) => {
    const { $context } = component

    const event = applyContextTransformToPointerEvent($context, _event)

    listener(event, _event)
  }

  $element.addEventListener('dragend', dragStartListener, _global)

  return () => {
    $element.removeEventListener('dragend', dragStartListener, _global)
  }
}
