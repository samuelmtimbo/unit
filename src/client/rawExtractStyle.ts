import { Style } from '../system/platform/Style'
import { MeasureTextFunction } from '../text'
import { Dict } from '../types/Dict'
import { camelToDashed } from './id'
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

export function cssTextToObj(cssText: string): Dict<string> {
  return Object.fromEntries(
    cssText
      .split(';')
      .filter((rule) => rule.trim())
      .map((rule) => rule.split(':').map((part) => part.trim()))
  )
}

export function objToCssText(obj: Dict<string>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${camelToDashed(key)}: ${value};`)
    .join(' ')
}

export function rawExtractStyle(
  element: IOElement,
  trait: LayoutNode,
  measureText: MeasureTextFunction
): Style {
  if (element instanceof Text) {
    return rawSimulateTextStyle(element, trait, measureText)
  }

  const { style } = element

  return cssTextToObj(style.cssText)
}
