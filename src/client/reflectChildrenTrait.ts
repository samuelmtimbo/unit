import { _NUMBER_LITERAL_REGEX } from '../spec/regex/NUMBER_LITERAL'
import { Style } from '../system/platform/Props'
import { LayoutNode } from './LayoutNode'
import { parseBorder } from './parseBorder'
import { parseLayoutValue } from './parseLayoutValue'
import { parseMargin } from './parseMargin'
import { parsePadding } from './parsePadding'
import { parseTransformXY } from './parseTransformXY'
import { Rect, Size, rectsBoundingRect } from './util/geometry'
import { parseFontSize } from './util/style/getFontSize'
import { parseOpacity } from './util/style/getOpacity'

export type LayoutBox = {
  x: number
  y: number
  width: number
  height: number
}

export const REGEX_PERCENT = /^([0-9]+)%$/
export const REGEX_PX = new RegExp('^(' + _NUMBER_LITERAL_REGEX.source + ')px$')
export const REGEX_CALC =
  /^calc\(([0-9]+)%([+]{0,1}[-]{0,1}[0-9]+(?:\.\d*)?)px\)$/

export function reflectChildrenTrait(
  parentTrait: LayoutNode,
  parentStyle: Style,
  children: Style[],
  expandChild: (path: number[]) => Style[] = () => [],
  path: number[] = [],
  rootStyle: Style = parentStyle,
  expandChildren: boolean = true
): [LayoutNode[], Size] {
  const {
    x: parentX,
    y: parentY,
    fontSize: parentFontSize,
    opacity: parentOpacity,
    sx: parentScaleX,
    sy: parentScaleY,
    width: parentWidth,
    height: parentHeight,
  } = parentTrait

  let _parentStyle = parentStyle

  if (parentStyle.display === 'contents') {
    _parentStyle = rootStyle
  }

  const {
    display: parentDisplay = 'block',
    flexDirection: parentFlexDirection = 'row',
    flexWrap: parentFlexWrap = 'nowrap',
    justifyContent: parentJustifyContent = 'start',
    gap: parentGap = '0px',
    alignItems: parentAlignItems = 'start',
    alignContent: parentAlignContent = 'normal',
    padding: parentPadding = '0px',
    paddingTop: parentPaddingTop = '',
    paddingLeft: parentPaddingLeft = '',
    width: parentStyleWidth = '',
    height: parentStyleHeight = '',
  } = _parentStyle

  const parent_fit_width = parentStyleWidth === 'fit-content'
  const parent_fit_height = parentStyleHeight === 'fit-content'

  let {
    left: pxPaddingLeft,
    top: pxPaddingTop,
    right: pxPaddingRight,
    bottom: pxPaddingBottom,
  } = parsePadding(parentPadding)

  if (parentPaddingLeft) {
    pxPaddingLeft = parseLayoutValue(parentPaddingLeft)[0]
  }

  if (parentPaddingTop) {
    pxPaddingTop = parseLayoutValue(parentPaddingTop)[0]
  }

  const pxPaddingHorizontal = pxPaddingLeft + pxPaddingRight
  const pxPaddingVertical = pxPaddingTop + pxPaddingBottom

  const childrenTrait: LayoutNode[] = []

  const [pxParentGap] = parseLayoutValue(parentGap)

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

  const children_border_left_width: number[] = []
  const children_border_right_width: number[] = []
  const children_border_top_width: number[] = []
  const children_border_bottom_width: number[] = []

  let i = 0

  let postChildrenStyle: [number, Style][] = []

  for (const childStyle of children) {
    let x = parentX
    let y = parentY

    let width = 0
    let height = 0

    const {
      display: childDisplay = 'block',
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
      padding: childPadding = '',
      aspectRatio: childAspectRatio = '',
    } = childStyle

    let [pxLeft, pcLeft] = parseLayoutValue(childLeft)
    let [pxTop, pcTop] = parseLayoutValue(childTop)

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

    children_border_left_width.push(pxBorderWidth)
    children_border_right_width.push(pxBorderWidth)
    children_border_top_width.push(pxBorderWidth)
    children_border_bottom_width.push(pxBorderWidth)

    let child_children_style: Style[]
    let children_trait: LayoutNode[]
    let children_bounding_rect: Rect

    const display_contents = childDisplay === 'contents'

    const fit_width = childWidth === 'fit-content'
    const fit_height = childHeight === 'fit-content'

    const reflect_children =
      expandChildren && (fit_width || fit_height || display_contents)

    if (reflect_children) {
      child_children_style = child_children_style || expandChild(_path)

      const relative_children_style = child_children_style.filter(
        ({ position }) => {
          return position !== 'fixed' && position !== 'absolute'
        },
        []
      )

      const _childStyle = display_contents ? _parentStyle : childStyle

      const [reflected_children_trait, reflected_children_size] =
        reflectChildrenTrait(
          parentTrait,
          _childStyle,
          relative_children_style,
          expandChild,
          _path
        )

      children_trait = reflected_children_trait
    }

    if (reflect_children && (fit_width || display_contents)) {
      children_bounding_rect =
        children_bounding_rect || rectsBoundingRect(children_trait)

      pxWidth = children_bounding_rect.width
    } else {
      const parsedWidth = parseLayoutValue(childWidth)

      pxWidth = parsedWidth[0]
      pcWidth = parsedWidth[1]
    }

    if (reflect_children && (fit_height || display_contents)) {
      children_bounding_rect =
        children_bounding_rect || rectsBoundingRect(children_trait)

      pxHeight = children_bounding_rect.height
    } else {
      const parsedHeight = parseLayoutValue(childHeight)

      pxHeight = parsedHeight[0]
      pcHeight = parsedHeight[1]
    }

    width += (pcWidth * (parentWidth - pxPaddingHorizontal)) / 100 + pxWidth
    height += (pcHeight * (parentHeight - pxPaddingVertical)) / 100 + pxHeight

    if (childBoxSizing === 'content-box') {
      width += 2 * pxBorderWidth
      height += 2 * pxBorderWidth
    }

    if (childPadding) {
      const {
        left: pxPaddingLeft,
        top: pxPaddingTop,
        right: pxPaddingRight,
        bottom: pxPaddingBottom,
      } = parsePadding(childPadding)

      if (childBoxSizing === 'border-box') {
        if (fit_width) {
          width += pxPaddingLeft + pxPaddingRight
        }

        if (fit_height) {
          height += pxPaddingTop + pxPaddingBottom
        }
      } else if (childBoxSizing === 'content-box') {
        width += pxPaddingLeft + pxPaddingRight
        height += pxPaddingTop + pxPaddingBottom
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

    let fontSize =
      (childFontSizeStr && parseFontSize(childFontSize)) || parentFontSize

    const fontSizeUnit = childFontSizeStr?.match(/(px|em|rem|pt|vw|vh|%)$/)?.[1]

    if (fontSizeUnit === 'vw') {
      fontSize *= parentWidth / 100
    }

    if (fontSizeUnit === 'vh') {
      fontSize *= parentHeight / 100
    }

    const childOpacity = parseOpacity(childOpacityStr)

    if (parentDisplay === 'block') {
      if (childPosition === 'relative') {
        x += (pcLeft * parentWidth) / 100
        y +=
          (total_relative_percent_height * parentHeight * parentScaleY) / 100 +
          total_relative_px_height +
          (pcTop * parentHeight) / 100
      } else if (childPosition === 'absolute') {
        x += pxLeft + (pcLeft * parentWidth) / 100
        y += pxTop + (pcTop * parentHeight) / 100
      } else {
        //
      }

      x += pxPaddingLeft
      y += pxPaddingTop
    } else if (parentDisplay === 'flex') {
      postChildrenStyle.push([i, childStyle])

      if (parentFlexDirection === 'row') {
        if (parentJustifyContent === 'center') {
          //
        } else {
          x += pxPaddingLeft
          y += pxPaddingTop
        }
      } else if (parentFlexDirection === 'column') {
        if (parentJustifyContent === 'center') {
          //
        } else {
          x += pxPaddingLeft
          y += pxPaddingTop
        }
      } else {
        console.log(`flex-direction not supported: ${parentFlexDirection}`)
      }
    }

    x += childTransformX
    y += childTransformY

    if (childPosition === 'relative') {
      total_relative_percent_width += pcWidth
      total_relative_px_width += pxWidth
      total_relative_percent_height += pcHeight
      total_relative_px_height += pxHeight
    }

    const sx = parentScaleX * childScaleX
    const sy = parentScaleY * childScaleY
    const opacity = parentOpacity * childOpacity

    const childTrait: LayoutNode = {
      x,
      y,
      width,
      height,
      fontSize,
      sx,
      sy,
      opacity,
    }

    childrenTrait.push(childTrait)

    i++
  }

  let acc_relative_width = 0
  let acc_relative_height = 0

  let min_x = Infinity
  let min_y = Infinity
  let max_x = -Infinity
  let max_y = -Infinity

  const effectiveWidth = parent_fit_width
    ? total_relative_px_width
    : parentWidth
  const effectiveHeight = parent_fit_height
    ? total_relative_px_height
    : parentHeight

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

    const pxBorderLeft = children_border_left_width[i]
    const pxBorderRight = children_border_right_width[i]
    const pxBorderTop = children_border_top_width[i]
    const pxBorderBottom = children_border_bottom_width[i]

    const applyParentLeftPadding = () => {
      x += pxPaddingLeft
    }

    const applyParentTopPadding = () => {
      y += pxPaddingTop
    }

    const {
      position: childPosition = 'relative',
      transform: childTransform,
      boxSizing: childBoxSizing = 'content-box',
      padding: childPadding = '',
      paddingLeft: childPaddingLeft = '',
      paddingRight: childPaddingRight = '',
      paddingTop: childPaddingTop = '',
      paddingBottom: childPaddingBottom = '',
    } = childStyle

    if (childBoxSizing === 'content-box') {
      width += pxBorderLeft + pxBorderRight
      height += pxBorderTop + pxBorderBottom
    }

    if (childBoxSizing === 'content-box') {
      if (childPadding) {
        const {
          left: pxPaddingLeft,
          top: pxPaddingTop,
          right: pxPaddingRight,
          bottom: pxPaddingBottom,
        } = parsePadding(childPadding)

        if (!childPaddingLeft) {
          width += pxPaddingLeft
        }

        if (!childPaddingRight) {
          width += pxPaddingRight
        }

        if (!childPaddingTop) {
          height += pxPaddingTop
        }

        if (!childPaddingBottom) {
          height += pxPaddingBottom
        }
      }

      if (childPaddingLeft) {
        const pxPaddingLeft = parseLayoutValue(childPaddingLeft)[0]

        width += pxPaddingLeft
      }

      if (childPaddingTop) {
        const pxPaddingTop = parseLayoutValue(childPaddingTop)[0]

        height += pxPaddingTop
      }
    }

    if (parentDisplay === 'block') {
      const pcWidth =
        total_relative_percent_width > 0
          ? (percentWidth / total_relative_percent_width) *
            (parentWidth - total_relative_px_width - pxPaddingHorizontal)
          : 0

      x += pxLeft
      y += pxTop

      width += pcWidth + pxWidth
    } else if (parentDisplay === 'flex') {
      if (parentFlexDirection === 'row') {
        if (childPosition === 'relative') {
          const pcWidth =
            total_relative_percent_width > 0
              ? (percentWidth / total_relative_percent_width) *
                (effectiveWidth - total_relative_px_width - pxPaddingHorizontal)
              : 0

          const pcHeight =
            (percentHeight * (parentHeight - pxPaddingVertical)) / 100

          if (parentFlexWrap === 'nowrap') {
            if (total_relative_px_width > parentWidth) {
              const pxpcWidth =
                (pxWidth / total_relative_px_width) *
                (effectiveWidth - 0 - pxPaddingHorizontal)

              width += pxpcWidth
            } else {
              width += pcWidth + pxWidth
            }
          } else {
            width += pcWidth + pxWidth
          }

          height += pcHeight + pxHeight

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

          if (
            parentAlignContent === 'center' ||
            parentJustifyContent === 'center'
          ) {
            //
          } else if (parentJustifyContent === 'start') {
            applyParentLeftPadding()
          }

          if (
            parentAlignContent === 'center' ||
            parentAlignItems === 'center'
          ) {
            //
          } else if (parentAlignItems === 'start') {
            applyParentTopPadding()
          }

          if (inline) {
            acc_relative_width += width
          } else {
            acc_relative_width = width
          }
        } else if (childPosition === 'absolute') {
          x += pxLeft + (percentLeft * effectiveWidth) / 100
          y += pxTop + (percentTop * effectiveHeight) / 100

          width += (percentWidth * effectiveWidth) / 100 + pxWidth
          height += (percentHeight * effectiveHeight) / 100 + pxHeight

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
          const pcWidth =
            (percentWidth * (effectiveWidth - pxPaddingHorizontal)) / 100

          const pcHeight =
            total_relative_percent_height > 0
              ? (percentHeight /
                  (parentFlexWrap === 'nowrap'
                    ? total_relative_percent_height
                    : 100)) *
                (effectiveHeight - total_relative_px_height - pxPaddingVertical)
              : 0

          width += pcWidth + pxWidth

          if (parentFlexWrap === 'nowrap') {
            if (total_relative_px_height > effectiveHeight) {
              const pxpcHeight =
                (pxHeight / total_relative_px_height) *
                (effectiveHeight - 0 - pxPaddingVertical)

              height += pxpcHeight
            } else {
              height += pcHeight + pxHeight
            }
          } else {
            height += pcHeight + pxHeight
          }

          x += pxLeft
          y += acc_relative_height + pxTop

          max_relative_width = Math.max(max_relative_width, width)

          const inline = acc_relative_height + height <= effectiveHeight

          if (inline) {
            max_relative_width = Math.max(max_relative_width, width)
          } else {
            total_max_relative_width += max_relative_width

            max_relative_width = 0
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

          if (
            parentAlignContent === 'center' ||
            parentAlignItems === 'center'
          ) {
            //
          } else if (parentAlignItems === 'start') {
            applyParentLeftPadding()
          }

          if (
            parentAlignContent === 'center' ||
            parentJustifyContent === 'center'
          ) {
            //
          } else if (parentJustifyContent === 'start') {
            applyParentTopPadding()
          }

          if (inline) {
            acc_relative_height += height
          } else {
            acc_relative_height = height
          }
        } else if (childPosition === 'absolute') {
          x += pxLeft + (percentLeft * effectiveWidth) / 100
          y += pxTop + (percentTop * effectiveHeight) / 100

          width += (percentWidth * effectiveWidth) / 100 + pxWidth
          height += (percentHeight * effectiveHeight) / 100 + pxHeight

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

    if (childPosition === 'relative') {
      min_x = Math.min(min_x, x - pxLeft)
      min_y = Math.min(min_y, y - pxTop)
      max_x = Math.max(max_x, x + width)
      max_y = Math.max(max_y, y + height)
    }

    const childTrait = childrenTrait[i]

    childTrait.x = x
    childTrait.y = y
    childTrait.width = width
    childTrait.height = height
  }

  const internal_width = max_x - min_x
  const internal_height =
    max_y - min_y + pxParentGap * (postChildrenStyle.length - 1)

  const half_internal_width = internal_width / 2
  const half_internal_height = internal_height / 2

  let acc_gap = 0

  for (const [i, childStyle] of postChildrenStyle) {
    if (
      childStyle.position === 'relative' ||
      childStyle.position === undefined
    ) {
      const childTrait = childrenTrait[i]

      if (parentDisplay === 'flex') {
        if (parentFlexDirection === 'column') {
          if (parentJustifyContent === 'start') {
            //
          } else if (parentJustifyContent === 'center') {
            childTrait.y += (effectiveHeight - internal_height) / 2 + acc_gap
          }

          if (parentAlignItems === 'start') {
            //
          } else if (parentAlignItems === 'center') {
            childTrait.x += (effectiveWidth - childTrait.width) / 2
          }
        } else if (parentFlexDirection === 'row') {
          if (parentJustifyContent === 'start') {
            //
          } else if (parentJustifyContent === 'center') {
            childTrait.x += (effectiveWidth - internal_width) / 2 + acc_gap
          }

          if (parentAlignItems === 'start') {
            //
          } else if (parentAlignItems === 'center') {
            childTrait.y += (effectiveHeight - childTrait.height) / 2
          }
        }
      }

      acc_gap += pxParentGap
    }
  }

  return [
    childrenTrait,
    {
      width: parent_fit_width ? total_relative_px_width : 0,
      height: parent_fit_height ? total_relative_px_height : 0,
    },
  ]
}
