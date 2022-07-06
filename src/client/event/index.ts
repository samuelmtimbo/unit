import { Unlisten } from '../../types/Unlisten'
import { IOElement } from '../IOElement'

export function _addEventListener(
  type: string,
  element: IOElement | ShadowRoot,
  listener: (event: Event) => void,
  _global: boolean = false
): Unlisten {
  if (_global) {
    element.addEventListener(type, listener)
    const _type = `_${type}`
    const _listener = (_event: CustomEvent<any>) => {
      const { detail: event } = _event
      listener(event)
    }
    element.addEventListener(_type, _listener)
    return () => {
      element.removeEventListener(type, listener)
      element.removeEventListener(_type, _listener)
    }
  } else {
    element.addEventListener(type, listener)
    return () => {
      element.removeEventListener(type, listener)
    }
  }
  // $element.addEventListener(type, listener, _global)
  // return () => {
  //   $element.removeEventListener(type, listener, _global)
  // }
}
