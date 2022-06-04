import { Style } from '../system/platform/Props'
import { Component } from './component'
import { Size } from './util/geometry'

export function extractStyle(
  component: Component,
  measureText: (text: string, fontSize: number) => Size
): Style {
  const style = {}

  const { $element } = component

  if ($element instanceof Text) {
    const fontSize = component.getFontSize()

    const { textContent } = component.$element

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

  if ($element instanceof HTMLCanvasElement) {
    if (style['width'] === undefined) {
      const { width } = $element

      style['width'] = `${width}px`
    }

    if (style['height'] === undefined) {
      const { height } = $element

      style['height'] = `${height}px`
    }
  }

  return style
}
