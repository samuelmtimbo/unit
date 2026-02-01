import { System } from '../../../system'
import { Rect } from '../geometry/types'
import { getPosition } from './getPosition'
import { getSize } from './getSize'

export function getRect(system: System, element): Rect {
  const { x, y } = getPosition(element)
  const { width, height } = getSize(system, element)

  return {
    x,
    y,
    width,
    height,
  }
}
