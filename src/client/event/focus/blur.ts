import Listenable from '../../Listenable'
import { Listener } from '../../Listener'
import IOFocusEvent from './FocusEvent'

export function makeBlurListener(
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): Listener {
  return (component) => {
    return listenBlur(component, listener)
  }
}

export function listenBlur(
  component: Listenable,
  listener: (event: IOFocusEvent, _event: FocusEvent) => void
): () => void {
  const { $element } = component
  const blurListener = (_event: FocusEvent) => {
    const { relatedTarget } = _event

    listener && listener({ relatedTarget }, _event)
  }
  $element.addEventListener('blur', blurListener)
  return () => {
    $element.removeEventListener('blur', blurListener)
  }
}
