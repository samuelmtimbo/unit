import { Rect } from '../geometry'
import { getPosition } from './getPosition'
import { getSize } from './getSize'

export function getRect(element): Rect {
  const { x, y } = getPosition(element)
  const { width, height } = getSize(element)

  return {
    x,
    y,
    width,
    height,
  }
}
