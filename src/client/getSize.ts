import { IOElement } from './IOElement'
import { Size } from './util/geometry'

export function getSize(element: IOElement): Size {
  // RETURN
  // AD HOC
  if (!(element instanceof HTMLElement)) {
    return { width: 0, height: 0 }
  }

  const bb = element.getBoundingClientRect()
  const { width, height } = bb
  return { width, height }
  // const { offsetWidth, offsetHeight } = element

  // return { width: offsetWidth, height: offsetHeight }
}
