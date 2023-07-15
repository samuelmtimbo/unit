import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { IOMouseEvent, applyContextTransformToPointerEvent } from '../pointer'

export type IODragStartEvent = IOMouseEvent

export function makeDragStartListener(
  listener: (event: IODragStartEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDragStart(component, listener, _global)
  }
}

export function listenDragStart(
  component: Listenable,
  listener: (event: IODragStartEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dragStartListener = (_event: DragEvent) => {
    const { $context } = component

    const event = applyContextTransformToPointerEvent($context, _event)

    listener(event)
  }
  $element.addEventListener('dragstart', dragStartListener, _global)
  return () => {
    $element.removeEventListener('dragstart', dragStartListener, _global)
  }
}
