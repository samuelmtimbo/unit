import { Style } from '../system/platform/Props'
import { Component } from './component'
import { measureText } from './util/style/measureText'

export function extractStyle(leaf_comp: Component): Style {
  const style = {}

  const { $element } = leaf_comp

  if ($element instanceof Text) {
    const fontSize = leaf_comp.getFontSize()

    const { textContent } = leaf_comp.$element

    const { width, height } = measureText(textContent, fontSize)

    return {
      left: '2px',
      top: '2px',
      width: `${width}px`,
      height: `${height}px`,
    }
  }

  for (const key in $element.style) {
    const value = $element.style[key]

    if (value && typeof value === 'string' && isNaN(parseInt(key))) {
      style[key] = value
    }
  }

  return style
}
