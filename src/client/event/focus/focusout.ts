import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import IOFocusEvent from './FocusEvent'

export function makeFocusOutListener(
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): Listener {
  return (component) => {
    return listenFocusOut(component, listener)
  }
}

export function listenFocusOut(
  component: Listenable,
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): () => void {
  const { $element } = component
  const focusInListener = (_event: FocusEvent) => {
    const { relatedTarget } = _event

    listener({ relatedTarget }, _event)
  }
  $element.addEventListener('focusout', focusInListener)
  return () => {
    $element.removeEventListener('focusout', focusInListener)
  }
}
