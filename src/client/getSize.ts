import { System } from '../system'
import { IOElement } from './IOElement'
import { Size } from './util/geometry/types'

export function getElementSize(system: System, element: IOElement): Size {
  const {
    api: {
      window: { HTMLElement },
      document: { createRange },
    },
  } = system

  if (!(element instanceof HTMLElement)) {
    const range = createRange()

    range.selectNodeContents(element)

    const rects = range.getClientRects()

    const rect = rects[0] || { width: 0, height: 0 }

    return rect
  }

  const bb = element.getBoundingClientRect()

  const { width, height } = bb

  return { width, height }
}
