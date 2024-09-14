import { isFrameRelativeValue } from '../isFrameRelative'
import { Style } from '../system/platform/Style'
import { MeasureTextFunction } from '../text'
import { getPathBoundingBox } from '../util/svg'
import { Component } from './component'
import { DEFAULT_FONT_SIZE } from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { isContentEditable } from './isTextLike'
import { LayoutNode } from './LayoutNode'
import { rawExtractStyle } from './rawExtractStyle'
import { parseFontSize } from './util/style/getFontSize'

export function extractStyle(
  component: Component,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  const { $node } = component

  return _extractStyle(component, $node, trait, measureText)
}

export function _extractStyle(
  component: Component,
  element: IOElement,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  const style = rawExtractStyle(element, trait, measureText)

  return _extractFromRawStyle(component, element, style, trait, measureText)
}

export function _extractFromRawStyle(
  component: Component,
  element: IOElement,
  style: Style,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  const fitWidth = style['width'] === 'fit-content'
  const fitHeight = style['height'] === 'fit-content'

  if (element instanceof Text) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    const { width, height } = measureText(textContent, fontSize, trait.width)

    style = {
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  if (isContentEditable(element) && (fitWidth || fitHeight)) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    const { width, height } = measureText(textContent, fontSize, trait.width)

    if (fitWidth) {
      style['width'] = `${width}px`
    }

    if (fitHeight) {
      style['height'] = `${height}px`
    }
  }

  if (style['display'] === 'contents') {
    style = {
      width: '100%',
      height: '100%',
    }
  }

  if (element instanceof HTMLCanvasElement) {
    const treatProp = (name: 'width' | 'height') => {
      const prop = component.getProp(name)

      if (prop !== undefined) {
        if (typeof prop === 'string') {
          if (isFrameRelativeValue(prop)) {
            const prop_num = prop.substring(0, prop.length - 2)

            style[name] = `${prop_num}%`
          } else {
            //
          }
        } else {
          style[name] = `${prop}px`
        }
      } else {
        style[name] = `${element[name]}px`
      }
    }

    treatProp('width')
    treatProp('height')
  }

  if (element instanceof HTMLInputElement) {
    if (
      element.type === 'text' ||
      element.type === 'number' ||
      element.type === 'password'
    ) {
      if (style.height === 'fit-content') {
        const { value } = element

        const fontSize = element.style.fontSize

        const fontSizeNum = parseFontSize(fontSize) ?? DEFAULT_FONT_SIZE

        const { height } = measureText(value, fontSizeNum, trait.width)

        style.height = `${height}px`
      }
    }

    if (element.type === 'range') {
      style.height = '18px'
    }
  } else if (element instanceof HTMLSelectElement) {
    style.height = '18px'
  }

  if (element instanceof SVGPathElement) {
    const d = element.getAttribute('d')

    const bb = getPathBoundingBox(d)

    style['width'] = `${bb.width}px`
    style['height'] = `${bb.height}px`

    // TODO
  }

  if (element instanceof SVGRectElement) {
    style['width'] = `${element.width.animVal.value}px`
    style['height'] = `${element.height.animVal.value}px`

    // TODO
  }

  if (element instanceof SVGCircleElement) {
    const r = element.r.animVal.value

    const width = 2 * r
    const height = width

    style['width'] = `${width}px`
    style['height'] = `${height}px`

    // TODO
  }

  return style
}
