import { IOElement } from '../../IOElement'
import { Size } from '../geometry'

export function getSize(element: IOElement): Size {
  if (element instanceof Text) {
    const range = document.createRange()
    range.selectNodeContents(element)
    const rects = range.getClientRects()
    const rect = rects[0] || { width: 0, height: 0 }
    return rect
  }

  const bb = element.getBoundingClientRect()

  const { width, height } = bb

  return { width, height }
}
