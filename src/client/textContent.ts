import { Component } from './component'
import { isTextLike } from './isText'
import { isTextField } from './isTextField'
import { getNodeApparentTextContent } from './util/style/getNodeApparentTextContent'

export function extractTextContent(component: Component): string {
  const textContent =
    isTextLike(component) || isTextField(component.$element)
      ? getNodeApparentTextContent(component.$element)
      : ''

  return textContent
}
