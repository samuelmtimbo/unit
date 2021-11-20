import Listenable from '../../Listenable'
import { Listener } from '../../Listener'
import IOFocusEvent from './FocusEvent'

export function makeFocusListener(
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): Listener {
  return (component) => {
    return listenFocus(component, listener)
  }
}

export function listenFocus(
  component: Listenable,
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): () => void {
  const { $element } = component
  const focusListener = (_event: FocusEvent) => {
    const { relatedTarget } = _event

    listener({ relatedTarget }, _event)
  }
  $element.addEventListener('focus', focusListener)
  return () => {
    $element.removeEventListener('focus', focusListener)
  }
}
