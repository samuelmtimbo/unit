import { isFrameRelativeValue } from '../isFrameRelative'
import { Style } from '../system/platform/Style'
import { MeasureTextFunction } from '../text'
import { Component } from './component'
import { camelToDashed } from './id'
import { IOElement } from './IOElement'
import { isContentEditable } from './isContentEditable'
import { LayoutNode } from './LayoutNode'
import { rawExtractStyle } from './rawExtractStyle'

export const LAYOUT_STYLE_ATTRS = [
  'position',
  'boxSizing',
  'margin',
  'marginLeft',
  'marginTop',
  'marginBottom',
  'marginRight',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'opacity',
  'fontSize',
  'transform',
  'aspectRatio',
  'color',
  'object-fit',
]

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

export function extractLayoutStyle(style: Style) {
  const style_ = {}

  for (const attr of LAYOUT_STYLE_ATTRS) {
    style_[attr] = style[attr] ?? style[camelToDashed(attr)] ?? ''
  }

  return style_
}

export function _extractFromRawStyle(
  component: Component,
  element: IOElement,
  style: Style,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  const {
    api: {
      window: { getComputedStyle },
    },
  } = component.$system

  const fitWidth = style['width'] === 'fit-content'
  const fitHeight = style['height'] === 'fit-content'

  if (element instanceof Text) {
    const { textContent } = component.$element

    const { width, height } = measureText(
      textContent,
      trait.fontSize,
      trait.width
    )

    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  const contentEditable = isContentEditable(element)

  if (contentEditable && (fitWidth || fitHeight)) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

    let { width, height } = measureText(textContent, fontSize, trait.width)

    if (fitWidth) {
      style['width'] = `${width}px`
    }

    if (fitHeight) {
      if (contentEditable && !textContent) {
        ;({ height } = measureText('|', fontSize, trait.width))
      }

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

      style[name] = '100%'

      if (prop !== undefined) {
        if (typeof prop === 'string') {
          if (isFrameRelativeValue(prop)) {
            const prop_num = prop.substring(0, prop.length - 2)

            style[`max-${name}`] = `${prop_num}%`
          } else {
            //
          }
        } else {
          style[`max-${name}`] = `${prop}px`
        }
      } else {
        style[`max-${name}`] = `${element[name]}px`
      }
    }

    style['aspect-ratio'] = '1 / 1'

    treatProp('width')
    treatProp('height')
  }

  if (element instanceof SVGElement) {
    const treatProp = (name: 'width' | 'height') => {
      if (style[name] === undefined) {
        style[name] = '100%'
      }
    }

    treatProp('width')
    treatProp('height')
  }

  if (element instanceof HTMLInputElement) {
    if (element.type === 'range') {
      style.height = '18px'
    }
  } else if (element instanceof HTMLSelectElement) {
    style.height = '18px'
  }

  return style
}
