import { Component } from './component'
import { isTextLike } from './isText'

export function extractTextContent(component: Component): string {
  const textContent = isTextLike(component)
    ? component.$element.textContent
    : ''

  return textContent
}
