import { Style } from '../system/platform/Style'
import { MeasureTextFunction } from '../text'
import { Component } from './component'
import { camelToDashed } from './id'
import { IOElement } from './IOElement'
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

  if (element instanceof SVGElement) {
    const treatProp = (name: 'width' | 'height') => {
      if (style[name] === undefined) {
        style[name] = '100%'
      }
    }

    treatProp('width')
    treatProp('height')
  }

  return style
}
