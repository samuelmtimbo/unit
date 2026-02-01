import { CodePathNotImplementedError } from '../../../exception/CodePathNotImplemented'
import { System } from '../../../system'
import { IOElement } from '../../IOElement'
import { Rect, Size } from '../geometry/types'
import { getRect } from './getRect'

export function getSize(system: System, element: IOElement): Size {
  const {
    api: {
      document: { createRange },
    },
  } = system

  if (element instanceof Text) {
    const range = createRange()

    range.selectNodeContents(element)

    const bb = range.getBoundingClientRect()

    const { width, height } = bb

    return { width, height }
  }

  if (element.classList.contains('__parent')) {
    const { width, height } = getChildrenRect(system, element)

    return { width, height }
  }

  const bb = element.getBoundingClientRect()

  const { width, height } = bb

  return { width, height }
}

export function getChildrenRect(system: System, element: IOElement): Rect {
  if (element instanceof HTMLElement) {
    const children = Array.from(element.children)

    const { minX, maxX, minY, maxY } = children.reduce(
      (acc, child) => {
        const { x, y, width, height } = getRect(system, child as IOElement)

        return {
          minX: Math.min(acc.minX, x),
          maxX: Math.max(acc.maxX, x + width),
          minY: Math.min(acc.minY, y),
          maxY: Math.max(acc.maxY, y + height),
        }
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    )

    const x = minX
    const y = minY
    const width = maxX - minX
    const height = maxY - minY

    return { x, y, width, height }
  } else if (element instanceof SVGElement) {
    throw new CodePathNotImplementedError()
  } else {
    throw new CodePathNotImplementedError()
  }
}
