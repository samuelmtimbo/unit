import { getChildIndex } from './getChildIndex'

export function replaceChild($element: Element, $nextElement: Element) {
  const parent = $element.parentElement
  if (parent) {
    const index = getChildIndex($element)
    parent.insertBefore($nextElement, parent.children[index])
    parent.removeChild($element)
  }
}
