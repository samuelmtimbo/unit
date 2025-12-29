import { Component } from './component'
import { getNodeApparentTextContent } from './util/style/getNodeApparentTextContent'

export function extractTextContent(component: Component): string {
  const textContent =
    component.isBase() &&
    !(component.$element as HTMLHtmlElement).children?.length
      ? getNodeApparentTextContent(component.$element)
      : ''

  return textContent
}
