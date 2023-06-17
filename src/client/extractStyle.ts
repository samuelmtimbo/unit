import { isFrameRelativeValue } from '../isFrameRelative'
import Iframe from '../system/platform/component/Iframe/Component'
import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import { getPathBoundingBox } from '../util/svg'
import { Component } from './component'
import { DEFAULT_FONT_SIZE } from './DEFAULT_FONT_SIZE'
import { IOElement } from './IOElement'
import { Size } from './util/geometry'
import { parseFontSize } from './util/style/getFontSize'

export function extractStyle(
  component: Component,
  measureText: (text: string, fontSize: number) => Size
): Style {
  const { $element } = component

  let _element = $element

  if (component instanceof Iframe) {
    _element = component._iframe_el
  }

  return _extractStyle(component, _element, measureText)
}

export function _extractStyle(
  component: Component,
  element: IOElement,
  measureText: (text: string, fontSize: number) => Size
): Style {
  if (element instanceof Text) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    const { width, height } = measureText(textContent, fontSize)

    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  const style = rawExtractStyle(element)

  if (style['display'] === 'contents') {
    return {
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
            // TODO
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

        const { height } = measureText(value, fontSizeNum)

        style.height = `${height}px`
      }
    }

    if (element.type === 'range') {
      style.height = '18px'
    }
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

export function rawExtractStyle(element: HTMLElement | SVGElement) {
  const style: Dict<string> = {}

  for (const key in element.style) {
    const value = element.style[key]

    if (value && typeof value === 'string' && isNaN(parseInt(key))) {
      style[key] = value
    }
  }

  return style
}
