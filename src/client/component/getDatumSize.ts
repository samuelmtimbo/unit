import { TreeNode, TreeNodeType } from '../../spec/parser'
import { Size } from '../util/geometry'

export const DELIMITER_WIDTH: number = 6
export const DELIMITER_HEIGHT: number = 16
export const COMMA_WIDTH: number = 6
export const COLON_WIDTH: number = 6
export const SPACE_WIDTH: number = 2
export const CONTAINER_ROW_LEFT_MARGIN: number = 1
export const CONTAINER_ROW_RIGHT_MARGIN: number = 1
export const CONTAINER_COLUMN_LEFT_MARGIN: number = 7
export const CONTAINER_COLUMN_RIGHT_MARGIN: number = 7

export const MIN_WIDTH = 6 // cursor
export const MAX_WIDTH = 180
export const MAX_HEIGHT = 180

export function getLeafWidth(value: string): number {
  if (value === '') {
    return MIN_WIDTH
  }
  return Math.min(Math.max(value.length * 6, MIN_WIDTH), MAX_WIDTH)
}

export const LEAF_HEIGHT: number = 16

const calcVerticalHeight = (data: TreeNode): number => {
  const verticalHeight =
    2 * DELIMITER_HEIGHT +
    data.children.reduce((acc, c) => acc + getDatumHeight(c), 0)
  return verticalHeight
}

// calculate width assuming there is no overflow
const calcHorizontalWidth = (data: TreeNode): number => {
  if (
    data.type === TreeNodeType.ObjectLiteral ||
    data.type === TreeNodeType.ArrayLiteral
  ) {
    let width = 1 // mobile
    width += 2 * DELIMITER_WIDTH
    width += CONTAINER_ROW_LEFT_MARGIN
    width += CONTAINER_ROW_RIGHT_MARGIN
    width += Math.max(
      data.children.reduce((acc, c) => acc + calcHorizontalWidth(c), 0),
      MIN_WIDTH
    )
    if (data.children.length > 1) {
      width += (data.children.length - 1) * (COMMA_WIDTH + SPACE_WIDTH)
    }
    return width
  } else if (data.type === TreeNodeType.KeyValue) {
    return (
      calcHorizontalWidth(data.children[0]) +
      COLON_WIDTH +
      SPACE_WIDTH +
      calcHorizontalWidth(data.children[1])
    )
  } else {
    return getDatumWidth(data)
  }
}

export const childrenOverflow = (data: TreeNode): boolean => {
  const { type } = data
  if (
    type === TreeNodeType.ObjectLiteral ||
    type === TreeNodeType.ArrayLiteral ||
    type === TreeNodeType.ArrayExpression ||
    type === TreeNodeType.KeyValue ||
    type === TreeNodeType.Expression ||
    type === TreeNodeType.Or ||
    type === TreeNodeType.And
  ) {
    const totalWidth = calcHorizontalWidth(data)
    if (totalWidth > MAX_WIDTH) {
      return true
    }
    for (let child of data.children) {
      if (childrenOverflow(child)) {
        return true
      }
    }
  }
  return false
}

export function getDatumWidth(data: TreeNode): number {
  let { value, type } = data

  if (value === '') {
    return MIN_WIDTH
  }

  // if (type === TreeNodeType.Generic) {
  //   value = value.substr(1, value.length - 2)
  // }

  let horizontalWidth: number

  // TODO
  let width = MIN_WIDTH
  switch (type) {
    case TreeNodeType.Any:
    case TreeNodeType.Invalid:
    case TreeNodeType.Generic:
    case TreeNodeType.Null:
    case TreeNodeType.Regex:
    case TreeNodeType.Identifier:
    case TreeNodeType.StringLiteral:
    case TreeNodeType.BooleanLiteral:
    case TreeNodeType.Object:
    case TreeNodeType.String:
    case TreeNodeType.Number:
    case TreeNodeType.Boolean:
    case TreeNodeType.NumberLiteral:
    case TreeNodeType.RegexLiteral:
    case TreeNodeType.Regex:
    case TreeNodeType.Unit:
    case TreeNodeType.Class:
    case TreeNodeType.ClassLiteral:
    case TreeNodeType.ArithmeticExpression:
      width = getLeafWidth(value)
      break
    case TreeNodeType.ArrayLiteral:
    case TreeNodeType.ObjectLiteral:
      horizontalWidth = calcHorizontalWidth(data)
      if (horizontalWidth <= MAX_WIDTH) {
        width = horizontalWidth
      } else {
        width =
          CONTAINER_COLUMN_LEFT_MARGIN +
          CONTAINER_COLUMN_RIGHT_MARGIN +
          Math.max(
            data.children.reduce(
              (acc, c, index) =>
                Math.max(
                  acc,
                  getDatumWidth(c) +
                    (index < data.children.length - 1
                      ? COMMA_WIDTH + SPACE_WIDTH
                      : 0)
                ),
              0
            ),
            MIN_WIDTH
          )
      }
      break
    case TreeNodeType.Or:
    case TreeNodeType.And:
      width = data.children.reduce((acc, c, index) => {
        const _width = calcHorizontalWidth(c)

        const nextWidth =
          acc +
          getDatumWidth(c) +
          (index < data.children.length - 1 ? DELIMITER_WIDTH : 0)

        if (nextWidth <= MAX_WIDTH) {
          return nextWidth
        } else {
          return Math.max(acc, _width)
        }
      }, 0)
      break
    case TreeNodeType.ArrayExpression:
    case TreeNodeType.ObjectExpression:
      horizontalWidth =
        calcHorizontalWidth(data.children[0]) + 2 * DELIMITER_WIDTH
      if (horizontalWidth <= MAX_WIDTH) {
        width = horizontalWidth
      } else {
        width = getDatumWidth(data.children[0])
      }
      break
    case TreeNodeType.Expression:
      width = getDatumWidth(data.children[0]) + 2 * DELIMITER_WIDTH
      break
    case TreeNodeType.KeyValue:
      const valueOverflow = childrenOverflow(data.children[1])
      if (valueOverflow) {
        width = Math.max(
          getDatumWidth(data.children[0]) + COLON_WIDTH,
          getDatumWidth(data.children[1])
        )
      } else {
        width =
          getDatumWidth(data.children[0]) +
          getDatumWidth(data.children[1]) +
          COLON_WIDTH +
          SPACE_WIDTH
      }
      break
    default:
      width = MIN_WIDTH
  }

  return width
}

export function getDatumHeight(data: TreeNode): number {
  let horizontalWidth: number
  let verticalHeight: number
  let overflowWidth: boolean

  let height = 16

  switch (data.type) {
    case TreeNodeType.Generic:
    case TreeNodeType.Identifier:
    case TreeNodeType.Regex:
    case TreeNodeType.StringLiteral:
    case TreeNodeType.BooleanLiteral:
    case TreeNodeType.Object:
    case TreeNodeType.String:
    case TreeNodeType.Number:
    case TreeNodeType.Boolean:
    case TreeNodeType.NumberLiteral:
    case TreeNodeType.RegexLiteral:
    case TreeNodeType.Regex:
    case TreeNodeType.Unit:
    case TreeNodeType.Class:
    case TreeNodeType.ClassLiteral:
      height = LEAF_HEIGHT
      break
    case TreeNodeType.ObjectLiteral:
    case TreeNodeType.ArrayLiteral:
    case TreeNodeType.Or:
    case TreeNodeType.And:
    case TreeNodeType.Expression:
      horizontalWidth = calcHorizontalWidth(data)
      overflowWidth = horizontalWidth > MAX_WIDTH
      if (!overflowWidth) {
        height = LEAF_HEIGHT
      } else {
        verticalHeight = calcVerticalHeight(data)
        height = verticalHeight
      }
      break
    case TreeNodeType.ArrayExpression:
    case TreeNodeType.ObjectExpression:
      horizontalWidth =
        calcHorizontalWidth(data.children[0]) + 2 * DELIMITER_WIDTH
      overflowWidth = horizontalWidth > MAX_WIDTH
      if (!overflowWidth) {
        height = LEAF_HEIGHT
      } else {
        verticalHeight = calcVerticalHeight(data.children[0])
        height = verticalHeight
      }
      break
    case TreeNodeType.KeyValue:
      height = getDatumHeight(data.children[1])
      break
    default:
      height = LEAF_HEIGHT
  }

  return height
}

// datum size can be safely cached
const _sizeCache: { [value: string]: Size } = {}
export function getDatumSize(data: TreeNode): Size {
  const { value } = data
  if (_sizeCache[value]) {
    return _sizeCache[value]
  }
  const size = {
    width: getDatumWidth(data),
    height: getDatumHeight(data),
  }
  _sizeCache[value] = size
  return size
}
