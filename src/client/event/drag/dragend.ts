import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { IOMouseEvent, applyContextTransformToPointerEvent } from '../pointer'

export type IODragEndEvent = IOMouseEvent

export function makeDragEndListener(
  listener: (event: IODragEndEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragEnd(component, listener, _global)
  }
}

export function listenDragEnd(
  component: Listenable,
  listener: (event: IODragEndEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragStartListener = (_event: DragEvent) => {
    const { $context } = component

    const event = applyContextTransformToPointerEvent($context, _event)

    listener(event)
  }

  $element.addEventListener('dragend', dragStartListener, _global)

  return () => {
    $element.removeEventListener('dragend', dragStartListener, _global)
  }
}
