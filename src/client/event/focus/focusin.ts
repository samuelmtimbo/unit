import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { IOFocusEvent } from './FocusEvent'

export function makeFocusInListener(
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): Listener {
  return (component) => {
    return listenFocusIn(component, listener)
  }
}

export function listenFocusIn(
  component: Listenable,
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): () => void {
  const { $element } = component
  const focusListener = (_event: FocusEvent) => {
    const { relatedTarget } = _event

    listener({ relatedTarget }, _event)
  }
  $element.addEventListener('focusin', focusListener)
  return () => {
    $element.removeEventListener('focusin', focusListener)
  }
}
