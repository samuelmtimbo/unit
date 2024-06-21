import { IODragEvent, parseDataTransfer } from '.'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { applyContextTransformToPointerEvent } from '../pointer'

export function makeDropListener(
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenDrop(component, listener, _global)
  }
}

export function listenDrop(
  component: Listenable,
  listener: (event: IODragEvent, _event: DragEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const dropListener = (_event: DragEvent) => {
    const { $context } = component

    const { dataTransfer } = _event

    const event = {
      ...applyContextTransformToPointerEvent($context, _event),
      dataTransfer: parseDataTransfer(dataTransfer),
    }

    listener(event, _event)
  }

  $element.addEventListener('drop', dropListener, _global)
  return () => {
    $element.removeEventListener('drop', dropListener, _global)
  }
}
