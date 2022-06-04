import { _NUMBER_LITERAL_REGEX } from '../spec/regex/NUMBER_LITERAL'
import { Style } from '../system/platform/Props'
import { LayoutNode } from './LayoutNode'
import { parseBorder } from './parseBorder'
import { parseLayoutValue } from './parseLayoutValue'
import { parseMargin } from './parseMargin'
import { parseTransformXY } from './parseTransformXY'
import { Rect, rectsBoundingRect } from './util/geometry'
import { parseFontSize } from './util/style/getFontSize'
import { parseOpacity } from './util/style/getOpacity'

export type LayoutBox = {
  x: number
  y: number
  width: number
  height: number
}

export const REGEX_PERCENT = /^([0-9]+)\%$/
export const REGEX_PX = new RegExp('^(' + _NUMBER_LITERAL_REGEX.source + ')px$')
export const REGEX_CALC =
  /^calc\(([0-9]+)\%([+]{0,1}[-]{0,1}[0-9]+(?:\.\d*)?)px\)$/

export function reflectChildrenTrait(
  parentTrait: LayoutNode,
  parentStyle: Style,
  children: Style[],
  expandChild: (path: number[]) => Style[] = () => [],
  path: number[] = []
): LayoutNode[] {
  const {
    x: parentX,
    y: parentY,
    fontSize: parentFontSize,
    opacity: parentOpacity,
  } = parentTrait

  const {
    display: parentDisplay = 'block',
    flexDirection: parentFlexDirection = 'row',
    flexWrap: parentFlexWrap = 'nowrap',
    justifyContent: parentJustifyContent = 'start',
    alignItems: parentAlignItems = 'start',
    alignContent: parentAlignContent = 'normal',
    transform: parentTransform = '',
  } = parentStyle

  const { width: parentWidth, height: parentHeight } = parentTrait

  const [
    parentTransformX,
    parentTransformY,
    parentScaleX,
    parentScaleY,
    parentRotateX,
    parentRotateY,
    parentRotateZ,
  ] = parseTransformXY(parentTransform, parentWidth, parentHeight)

  const childrenTrait: LayoutNode[] = []

  let total_relative_percent_width = 0
  let total_relative_percent_height = 0

  let total_relative_px_width = 0
  let total_relative_px_height = 0

  let max_relative_width = 0
  let max_relative_height = 0

  let total_max_relative_width = 0
  let total_max_relative_height = 0

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

  for (const childStyle of children) {
    let x = parentX
    let y = parentY

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
      border: childBorder = '',
      margin: childMargin = '',
      boxSizing: childBoxSizing = 'content-box',
    } = childStyle

    let [pxLeft, pcLeft] = parseLayoutValue(childTop)
    let [pxTop, pcTop] = parseLayoutValue(childLeft)

    let pxWidth: number = 0
    let pxHeight: number = 0

    let pcWidth: number = 0
    let pcHeight: number = 0

    const _path = [...path, i]

    const {
      left: marginLeft,
      top: marginTop,
      right: marginRight,
      bottom: marginBottom,
    } = parseMargin(childMargin)

    const [pxMarginLeft] = parseLayoutValue(marginLeft)
    const [pxMarginRight] = parseLayoutValue(marginRight)
    const [pxMarginTop] = parseLayoutValue(marginTop)
    const [pxMarginBottom] = parseLayoutValue(marginBottom)

    x += pxMarginLeft
    y += pxMarginTop

    const {
      width: borderWidth,
      style: borderStyle,
      color: borderColor,
    } = parseBorder(childBorder)

    const [pxBorderWidth] = parseLayoutValue(borderWidth)

    let child_children_style: Style[]
    let children_trait: LayoutNode[]
    let children_bounding_rect: Rect

    const fit_width = childWidth === 'fit-content'
    const fit_height = childHeight === 'fit-content'

    const reflect_children = fit_width || fit_height

    if (reflect_children) {
      child_children_style = child_children_style || expandChild(_path)

      children_trait = reflectChildrenTrait(
        parentTrait,
        childStyle,
        child_children_style,
        expandChild,
        _path
      )
    }

    if (fit_width) {
      children_bounding_rect =
        children_bounding_rect || rectsBoundingRect(children_trait)

      pxWidth = children_bounding_rect.width
    } else {
      const parsedWidth = parseLayoutValue(childWidth)

      pxWidth = parsedWidth[0]
      pcWidth = parsedWidth[1]
    }

    if (fit_height) {
      children_bounding_rect =
        children_bounding_rect || rectsBoundingRect(children_trait)

      pxHeight = children_bounding_rect.height
    } else {
      const parsedHeight = parseLayoutValue(childHeight)

      pxHeight = parsedHeight[0]
      pcHeight = parsedHeight[1]
    }

    width =
      (pcWidth * parentWidth) / 100 + pxWidth
    height =
      (pcHeight * parentHeight) / 100 + pxHeight

    if (childBoxSizing === 'content-box') {
      width += 2 * pxBorderWidth
      height += 2 * pxBorderWidth
    }

    const [
      childTransformX,
      childTransformY,
      childScaleX,
      childScaleY,
      childRotateX,
      childRotateY,
      childRotateZ,
    ] = parseTransformXY(childTransform, width, height)

    children_px_left.push(pxLeft)
    children_percent_left.push(pcLeft)

    children_px_top.push(pxTop)
    children_percent_top.push(pcTop)

    children_percent_width.push(pcWidth)
    children_percent_height.push(pcHeight)

    children_px_width.push(pxWidth)
    children_px_height.push(pxHeight)

    const childFontSize = childFontSizeStr

    const fontSize =
      (childFontSizeStr && parseFontSize(childFontSize)) || parentFontSize

    const childOpacity = parseOpacity(childOpacityStr)

    if (parentDisplay === 'block') {
      if (childPosition === 'relative') {
        x += (pcLeft * parentWidth) / 100
        y +=
          (total_relative_percent_height * parentHeight) / 100 +
          total_relative_px_height +
          (pcTop * parentHeight) / 100

        x += childTransformX
        y += childTransformY
      } else if (childPosition === 'absolute') {
        x += pxLeft + (pcLeft * parentWidth) / 100
        y += pxTop + (pcTop * parentHeight) / 100

        x += childTransformX
        y += childTransformY
      } else {
        //
      }
    } else if (parentDisplay === 'flex') {
      postChildrenStyle.push([i, childStyle])
    }

    if (childPosition === 'relative') {
      total_relative_percent_width += pcWidth
      total_relative_px_width += pxWidth
      total_relative_percent_height += pcHeight
      total_relative_px_height += pxHeight
    }

    const k = parentScaleX * childScaleX // TODO
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
    let x = parentX
    let y = parentY

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

      x += pxLeft
      y += pxTop

      width = pcWidth + pxWidth
    } else if (parentDisplay === 'flex') {
      if (parentFlexDirection === 'row') {
        if (childPosition === 'relative') {
          const pcWidth =
            total_relative_percent_width > 0
              ? (percentWidth / total_relative_percent_width) *
                (parentWidth - total_relative_px_width)
              : 0

          const pcHeight = (percentHeight * parentHeight) / 100

          if (parentFlexWrap === 'nowrap') {
            if (total_relative_px_width > parentWidth) {
              const pxpcWidth =
                (pxWidth / total_relative_px_width) * (parentWidth - 0)

              width = pxpcWidth
            } else {
              width = pcWidth + pxWidth
            }
          } else {
            width = pcWidth + pxWidth
          }

          height = pcHeight + pxHeight

          x += acc_relative_width
          y += pxTop

          max_relative_height = Math.max(max_relative_height, height)

          const inline = acc_relative_width + width <= parentWidth

          if (inline) {
            max_relative_height = Math.max(max_relative_height, height)
          } else {
            total_max_relative_height += max_relative_height

            max_relative_height = 0
          }

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

          if (parentAlignContent === 'normal') {
            //
          } else if (parentAlignContent === 'start') {
            if (parentFlexWrap === 'wrap') {
              y += total_max_relative_height

              if (inline) {
                //
              } else {
                x = parentX
              }
            }
          } else if (parentAlignContent === 'center') {
            //
          }

          if (inline) {
            acc_relative_width += width
          } else {
            acc_relative_width = width
          }
        } else if (childPosition === 'absolute') {
          x += pxLeft + (percentLeft * parentWidth) / 100
          y += pxTop + (percentTop * parentHeight) / 100

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
          const pcWidth = (percentWidth * parentWidth) / 100

          const pcHeight =
            total_relative_percent_height > 0
              ? (percentHeight /
                  (parentFlexWrap === 'nowrap'
                    ? total_relative_percent_height
                    : 100)) *
                (parentHeight - total_relative_px_height)
              : 0

          width = pcWidth + pxWidth

          if (parentFlexWrap === 'nowrap') {
            if (total_relative_px_height > parentHeight) {
              const pxpcHeight =
                (pxHeight / total_relative_px_height) * (parentHeight - 0)

              height = pxpcHeight
            } else {
              height = pcHeight + pxHeight
            }
          } else {
            height = pcHeight + pxHeight
          }

          x += pxLeft
          y += acc_relative_height + pxTop

          max_relative_width = Math.max(max_relative_width, width)

          const inline = acc_relative_height + height <= parentHeight

          if (inline) {
            max_relative_width = Math.max(max_relative_width, width)
          } else {
            total_max_relative_width += max_relative_width

            max_relative_width = 0
          }

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

          if (parentAlignContent === 'normal') {
            //
          } else if (parentAlignContent === 'start') {
            if (parentFlexWrap === 'wrap') {
              x += total_max_relative_width

              if (inline) {
                //
              } else {
                y = parentY
              }
            }
          } else if (parentAlignContent === 'center') {
            //
          }

          if (inline) {
            acc_relative_height += height
          } else {
            acc_relative_height = height
          }
        } else if (childPosition === 'absolute') {
          x += pxLeft + (percentLeft * parentWidth) / 100
          y += pxTop + (percentTop * parentHeight) / 100

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
