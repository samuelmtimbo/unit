import Listenable from '../../Listenable'
import { Listener } from '../../Listener'
import IOFocusEvent from './FocusEvent'

export function makeBlurListener(listener: (data: any) => void): Listener {
  return (component) => {
    return listenBlur(component, listener)
  }
}

export function listenBlur(
  component: Listenable,
  listener: (event: IOFocusEvent) => void
): () => void {
  const { $element } = component
  const focusListener = (event: FocusEvent) => {
    listener && listener({})
  }
  $element.addEventListener('blur', focusListener)
  return () => {
    $element.removeEventListener('blur', focusListener)
  }
}
