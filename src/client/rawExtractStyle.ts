import { Style } from '../system/platform/Style'
import { MeasureTextFunction } from '../text'
import { Dict } from '../types/Dict'
import { IOElement } from './IOElement'
import { LayoutNode } from './LayoutNode'

export function rawSimulateTextStyle(
  element: Text,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  const { textContent } = element

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

export function rawExtractStyle(
  element: IOElement,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  if (element instanceof Text) {
    return rawSimulateTextStyle(element, trait, measureText)
  }

  const _style: Dict<string> = {}

  const { style } = element

  for (let i = 0; i < style.length; i++) {
    const key = style[i]
    const value = style.getPropertyValue(key)

    _style[key] = value
  }

  return _style
}
