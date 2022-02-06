import { Unlisten } from '../types/Unlisten'
import { IOElement } from './IOElement'

export function addGlobalBlurListener(
  $element: IOElement,
  listener: (event: FocusEvent) => void
): Unlisten {
  $element.addEventListener('blur', listener, true)
  return () => {
    $element.removeEventListener('blur', listener, true)
  }
}
