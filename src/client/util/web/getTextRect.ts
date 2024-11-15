import { System } from '../../../system'
import { Rect } from '../geometry/types'

export function getTextRect(system: System, node: Text): Rect {
  const {
    api: { document },
  } = system

  const range = document.createRange()

  range.selectNodeContents(node)

  const rect = range.getBoundingClientRect()

  return rect
}
