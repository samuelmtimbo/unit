import { Component } from './component'
import { isTextLike } from './isText'
import { isTextField } from './isTextField'

export function extractTextContent(component: Component): string {
  if (isTextField(component.$element)) {
    return (component.$element as HTMLTextAreaElement).value
  }

  if (isTextLike(component.$element)) {
    return component.$element.textContent
  }

  return extractParentTextContent(component.$element)
}

export function extractParentTextContent(element: HTMLElement) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join('')
}
