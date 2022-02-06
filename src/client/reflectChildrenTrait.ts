import { _NUMBER_LITERAL_REGEX } from '../spec/regex/NUMBER_LITERAL'
import { LayoutNode } from '../system/platform/component/app/Graph/Component'
import { Style } from '../system/platform/Props'
import { parseTransformXY } from './parseTransformXY'
import { parseFontSize } from './util/style/getFontSize'
import { parseOpacity } from './util/style/getOpacity'

export type LayoutBox = {
  x: number
  y: number
  width: number
  height: number
}

const REGEX_PERCENT = /^([0-9]+)\%$/
const REGEX_PX = new RegExp('^(' + _NUMBER_LITERAL_REGEX.source + ')px$')
const REGEX_CALC = /^calc\(([0-9]+)\%[+-]([0-9]+)px\)$/ // TODO

export function parseLayoutValue(value: string): [number, number] {
  const percentWidthTest = REGEX_PERCENT.exec(value)
  if (percentWidthTest) {
    return [0, parseFloat(percentWidthTest[1])]
  } else {
    const pxWidthTest = REGEX_PX.exec(value)
    if (pxWidthTest) {
      return [parseFloat(pxWidthTest[1]), 0]
    }
  }
}

export function reflectChildrenTrait(
  parentTrait: LayoutNode,
  parentStyle: Style,
  childrenStyle: Style[]
): LayoutNode[] {
  const { fontSize: parentFontSize, opacity: parentOpacity } = parentTrait

  const {
    display: parentDisplay = 'block',
    flexDirection: parentFlexDirection = 'row',
    justifyContent: parentJustifyContent = 'start',
    alignItems: parentAlignItems = 'start',
  } = parentStyle

  const { width: parentWidth, height: parentHeight } = parentTrait

  const childrenTrait: LayoutNode[] = []

  let total_relative_percent_width = 0
  let total_relative_percent_height = 0

  let total_relative_px_width = 0
  let total_relative_px_height = 0

  const children_percent_left: number[] = []
  const children_percent_top: number[] = []

  const children_px_left: number[] = []
  const children_px_top: number[] = []

  const children_percent_width: number[] = []
  const children_percent_height: number[] = []

  const children_px_width: number[] = []
  const children_px_height: number[] = []

  let i = 0

  let postChildrenStyle: [number, Style][] = []

  for (const childStyle of childrenStyle) {
    let x = 0
    let y = 0

    let width = 0
    let height = 0

    const {
      position: childPosition = 'relative',
      left: childLeft = '0px',
      top: childTop = '0px',
      width: childWidth = '100%',
      height: childHeight = '0px',
      fontSize: childFontSizeStr,
      opacity: childOpacityStr = '1',
      transform: childTransform = '',
    } = childStyle

    const [pxLeft, percentLeft] = parseLayoutValue(childTop)
    const [pxTop, percentTop] = parseLayoutValue(childLeft)
    const [pxWidth, percentWidth] = parseLayoutValue(childWidth)
    const [pxHeight, percentHeight] = parseLayoutValue(childHeight)

    children_px_left.push(pxLeft)
    children_percent_left.push(percentLeft)

    children_px_top.push(pxTop)
    children_percent_top.push(percentTop)

    children_percent_width.push(percentWidth)
    children_percent_height.push(percentHeight)

    children_px_width.push(pxWidth)
    children_px_height.push(pxHeight)

    const childFontSize = childFontSizeStr

    const fontSize =
      (childFontSizeStr && parseFontSize(childFontSize)) || parentFontSize

    const childOpacity = parseOpacity(childOpacityStr)

    if (parentDisplay === 'block') {
      if (childPosition === 'relative') {
        y = (total_relative_percent_height * parentHeight) / 100

        width = (percentWidth * parentWidth) / 100 + pxWidth
        height = (percentHeight * parentHeight) / 100 + pxHeight

        const [
          childTransformX,
          childTransformY,
          childScaleX,
          childScaleY,
          childRotateX,
          childRotateY,
          childRotateZ,
        ] = parseTransformXY(childTransform, width, height)

        x += childTransformX
        y += childTransformY
      } else if (childPosition === 'absolute') {
        x = pxLeft + (percentLeft * parentWidth) / 100
        y = pxTop + (percentTop * parentHeight) / 100

        width = (percentWidth * parentWidth) / 100 + pxWidth
        height = (percentHeight * parentHeight) / 100 + pxHeight

        const [
          childTransformX,
          childTransformY,
          childScaleX,
          childScaleY,
          childRotateX,
          childRotateY,
          childRotateZ,
        ] = parseTransformXY(childTransform, width, height)

        x += childTransformX
        y += childTransformY
      } else {
        //
      }
    } else if (parentDisplay === 'flex') {
      postChildrenStyle.push([i, childStyle])
    }

    total_relative_percent_width += percentWidth
    total_relative_px_width += pxWidth
    total_relative_percent_height += percentHeight
    total_relative_px_height += pxHeight

    let k = 1

    const opacity = parentOpacity * childOpacity

    const childTrait = {
      x,
      y,
      width,
      height,
      fontSize,
      k,
      opacity,
    }

    childrenTrait.push(childTrait)

    i++
  }

  let acc_relative_width = 0
  let acc_relative_height = 0

  for (const [i, childStyle] of postChildrenStyle) {
    let x = 0
    let y = 0

    let width = 0
    let height = 0

    const pxLeft = children_px_left[i]
    const pxTop = children_px_top[i]

    const percentLeft = children_percent_left[i]
    const percentTop = children_percent_top[i]

    const percentWidth = children_percent_width[i]
    const percentHeight = children_percent_height[i]

    const pxWidth = children_px_width[i]
    const pxHeight = children_px_height[i]

    const { position: childPosition = 'relative', transform: childTransform } =
      childStyle

    if (parentDisplay === 'block') {
      const pcWidth =
        total_relative_percent_width > 0
          ? (percentWidth / total_relative_percent_width) *
            (parentWidth - total_relative_px_width)
          : 0

      x = pxLeft
      y = pxTop

      width = pcWidth + pxWidth
    } else if (parentDisplay === 'flex') {
      if (parentFlexDirection === 'row') {
        if (childPosition === 'relative') {
          if (total_relative_px_width > width) {
            // TODO
          }

          const pcWidth =
            total_relative_percent_width > 0
              ? (percentWidth / total_relative_percent_width) *
                (parentWidth - total_relative_px_width)
              : 0

          const pcHeight = (percentHeight * parentHeight) / 100

          width = pcWidth + pxWidth
          height = pcHeight + pxHeight

          x = acc_relative_width
          y = pxTop

          if (parentJustifyContent === 'start') {
            //
          } else if (parentJustifyContent === 'center') {
            x += (parentWidth - total_relative_px_width) / 2
          }

          if (parentAlignItems === 'start') {
            //
          } else if (parentAlignItems === 'center') {
            y += (parentHeight - total_relative_px_height) / 2
          }

          acc_relative_width += width
        } else if (childPosition === 'absolute') {
          x = pxLeft + (percentLeft * parentWidth) / 100
          y = pxTop + (percentTop * parentHeight) / 100

          width = (percentWidth * parentWidth) / 100 + pxWidth
          height = (percentHeight * parentHeight) / 100 + pxHeight

          const [
            childTransformX,
            childTransformY,
            childScaleX,
            childScaleY,
            childRotateX,
            childRotateY,
            childRotateZ,
          ] = parseTransformXY(childTransform, width, height)

          x += childTransformX
          y += childTransformY
        } else {
          //
        }
      } else if (parentFlexDirection === 'column') {
        if (childPosition === 'relative') {
          // width = parentWidth
          const pcWidth = (percentWidth * parentWidth) / 100

          width = pcWidth + pxWidth

          const pcHeight =
            total_relative_percent_height > 0
              ? (percentHeight / total_relative_percent_height) *
                (parentHeight - total_relative_px_height)
              : 0

          if (total_relative_px_height > parentHeight) {
            const pxpcHeight =
              (pxHeight / total_relative_px_height) * (parentHeight - 0)

            height = pxpcHeight
          } else {
            height = pcHeight + pxHeight
          }

          x = pxLeft
          y = acc_relative_height + pxTop

          if (parentJustifyContent === 'start') {
            //
          } else if (parentJustifyContent === 'center') {
            y += (parentHeight - total_relative_px_height) / 2
          }

          if (parentAlignItems === 'start') {
            //
          } else if (parentAlignItems === 'center') {
            x += (parentWidth - total_relative_px_width) / 2
          }

          acc_relative_height += height
        } else if (childPosition === 'absolute') {
          x = pxLeft + (percentLeft * parentWidth) / 100
          y = pxTop + (percentTop * parentHeight) / 100

          width = (percentWidth * parentWidth) / 100 + pxWidth
          height = (percentHeight * parentHeight) / 100 + pxHeight

          const [
            childTransformX,
            childTransformY,
            childScaleX,
            childScaleY,
            childRotateX,
            childRotateY,
            childRotateZ,
          ] = parseTransformXY(childTransform, width, height)

          x += childTransformX
          y += childTransformY
        } else {
          //
        }
      }
    }

    const [
      childTransformX,
      childTransformY,
      childScaleX,
      childScaleY,
      childRotateX,
      childRotateY,
      childRotateZ,
    ] = parseTransformXY(childTransform, parentWidth, parentHeight)

    x += childTransformX
    y += childTransformY

    const childTrait = childrenTrait[i]

    childTrait.x = x
    childTrait.y = y
    childTrait.width = width
    childTrait.height = height
  }

  return childrenTrait
}
