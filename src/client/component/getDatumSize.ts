import { TreeNode, TreeNodeType } from '../../spec/parser'
import { Size } from '../util/geometry/types'

export const LEAF_HEIGHT: number = 16
export const DELIMITER_WIDTH: number = 6
export const DELIMITER_HEIGHT: number = LEAF_HEIGHT
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

export function getLeafWidth(value: string, fontSize: number): number {
  const k = fontSize / 12

  if (value === '') {
    return MIN_WIDTH * k
  }

  const _value = value.replace(/\n/g, '\\n')

  return Math.min(Math.max(_value.length * 6 * k, MIN_WIDTH * k), MAX_WIDTH * k)
}

const calcVerticalHeight = (data: TreeNode, fontSize: number): number => {
  const verticalHeight =
    2 * getLeafHeight('', fontSize) +
    data.children.reduce((acc, c) => acc + getDatumHeight(c, fontSize), 0)
  return verticalHeight
}

// calculate width assuming there is no overflow
const calcHorizontalWidth = (data: TreeNode, fontSize: number): number => {
  if (
    data.type === TreeNodeType.ObjectLiteral ||
    data.type === TreeNodeType.ArrayLiteral
  ) {
    let width = 1 // mobile
    width += 2 * DELIMITER_WIDTH
    width += CONTAINER_ROW_LEFT_MARGIN
    width += CONTAINER_ROW_RIGHT_MARGIN
    width += Math.max(
      data.children.reduce(
        (acc, c) => acc + calcHorizontalWidth(c, fontSize),
        0
      ),
      MIN_WIDTH
    )
    if (data.children.length > 1) {
      width += (data.children.length - 1) * (COMMA_WIDTH + SPACE_WIDTH)
    }
    return width
  } else if (data.type === TreeNodeType.KeyValue) {
    return (
      calcHorizontalWidth(data.children[0], fontSize) +
      COLON_WIDTH +
      SPACE_WIDTH +
      calcHorizontalWidth(data.children[1], fontSize)
    )
  } else {
    return getDatumWidth(data, fontSize)
  }
}

export const childrenOverflow = (data: TreeNode, fontSize: number): boolean => {
  const { type } = data
  if (
    type === TreeNodeType.ObjectLiteral ||
    type === TreeNodeType.ArrayLiteral ||
    type === TreeNodeType.ArrayExpression ||
    type === TreeNodeType.PropExpression ||
    type === TreeNodeType.KeyValue ||
    type === TreeNodeType.Expression ||
    type === TreeNodeType.Or ||
    type === TreeNodeType.And
  ) {
    const totalWidth = calcHorizontalWidth(data, fontSize)
    if (totalWidth > MAX_WIDTH) {
      return true
    }
    for (let child of data.children) {
      if (childrenOverflow(child, fontSize)) {
        return true
      }
    }
  }
  return false
}

export function getDatumWidth(data: TreeNode, fontSize: number): number {
  let { value, type } = data

  if (value === '') {
    return MIN_WIDTH
  }

  let horizontalWidth: number

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
    case TreeNodeType.Unit:
    case TreeNodeType.Class:
    case TreeNodeType.ClassLiteral:
    case TreeNodeType.ArithmeticExpression:
      width = getLeafWidth(value, fontSize)
      break
    case TreeNodeType.ArrayLiteral:
    case TreeNodeType.ObjectLiteral:
      horizontalWidth = calcHorizontalWidth(data, fontSize)
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
                  getDatumWidth(c, fontSize) +
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
        const _width = calcHorizontalWidth(c, fontSize)

        const nextWidth =
          acc +
          getDatumWidth(c, fontSize) +
          (index < data.children.length - 1 ? DELIMITER_WIDTH : 0)

        if (nextWidth <= MAX_WIDTH) {
          return nextWidth
        } else {
          return Math.max(acc, _width)
        }
      }, 0)
      break
    case TreeNodeType.PropExpression:
      width = data.children.reduce((acc, c, index) => {
        const _width = calcHorizontalWidth(c, fontSize)

        const nextWidth = acc + getDatumWidth(c, fontSize)

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
        calcHorizontalWidth(data.children[0], fontSize) + 2 * DELIMITER_WIDTH
      if (horizontalWidth <= MAX_WIDTH) {
        width = horizontalWidth
      } else {
        width = getDatumWidth(data.children[0], fontSize)
      }
      break
    case TreeNodeType.Expression:
      width = getDatumWidth(data.children[0], fontSize) + 2 * DELIMITER_WIDTH
      break
    case TreeNodeType.KeyValue:
      {
        const valueOverflow = childrenOverflow(data.children[1], fontSize)
        if (valueOverflow) {
          width = Math.max(
            getDatumWidth(data.children[0], fontSize) + COLON_WIDTH,
            getDatumWidth(data.children[1], fontSize)
          )
        } else {
          width =
            getDatumWidth(data.children[0], fontSize) +
            getDatumWidth(data.children[1], fontSize) +
            COLON_WIDTH +
            SPACE_WIDTH
        }
      }
      break
    default:
      width = MIN_WIDTH
  }

  return width
}

export function getLeafHeight(value: string, fontSize: number): number {
  return (LEAF_HEIGHT * fontSize) / 12
}

export function getDatumHeight(data: TreeNode, fontSize: number): number {
  let horizontalWidth: number
  let verticalHeight: number
  let overflowWidth: boolean

  let height = getLeafHeight('', fontSize)

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
    case TreeNodeType.Unit:
    case TreeNodeType.Class:
    case TreeNodeType.ClassLiteral:
      break
    case TreeNodeType.ObjectLiteral:
    case TreeNodeType.ArrayLiteral:
    case TreeNodeType.Or:
    case TreeNodeType.And:
    case TreeNodeType.Expression:
      horizontalWidth = calcHorizontalWidth(data, fontSize)
      overflowWidth = horizontalWidth > MAX_WIDTH
      if (!overflowWidth) {
        //
      } else {
        verticalHeight = calcVerticalHeight(data, fontSize)
        height = verticalHeight
      }
      break
    case TreeNodeType.ArrayExpression:
    case TreeNodeType.ObjectExpression:
      horizontalWidth =
        calcHorizontalWidth(data.children[0], fontSize) + 2 * DELIMITER_WIDTH
      overflowWidth = horizontalWidth > MAX_WIDTH
      if (!overflowWidth) {
        //
      } else {
        verticalHeight = calcVerticalHeight(data.children[0], fontSize)
        height = verticalHeight
      }
      break
    case TreeNodeType.KeyValue:
      height = getDatumHeight(data.children[1], fontSize)
      break
    default:
    //
  }

  return height
}

// datum size can be safely cached
const _sizeCache: { [value: string]: Size } = {}
export function getDatumSize(data: TreeNode, fontSize: number): Size {
  const { value } = data
  if (_sizeCache[value]) {
    return _sizeCache[value]
  }
  const size = {
    width: getDatumWidth(data, fontSize),
    height: getDatumHeight(data, fontSize),
  }
  _sizeCache[value] = size
  return size
}
