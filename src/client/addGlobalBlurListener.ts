import { Unlisten } from '../types/Unlisten'
import { IOElement } from './IOElement'

export function addGlobalBlurListener(
  $element: IOElement,
  listener: (event: FocusEvent) => void
): Unlisten {
  const _listener = (event: FocusEvent) => {
    const { relatedTarget } = event

    if (relatedTarget === null) {
      listener(event)
    }
  }

  $element.addEventListener('blur', _listener, true)

  return () => {
    $element.removeEventListener('blur', _listener, true)
  }
}
