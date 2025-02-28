import { Dict } from '../types/Dict'
import { IOElement } from './IOElement'

export function extractAttr(element: IOElement): Dict<string> {
  if (element instanceof Text) {
    return {}
  }

  const attr = {}

  for (let attribute of element.attributes) {
    attr[attribute.name] = attribute.value
  }

  return attr
}

export function applyAttr(
  element: Element,
  attr: Dict<string>,
  current: Dict<string>
) {
  for (const name in current) {
    const value = attr[name]

    if (value === undefined) {
      element.removeAttribute(name)
    }
  }

  mergeAttr(element, attr)
}

export function removeAllAttr(element: Element) {
  const attributes = element.attributes

  for (const attr of attributes) {
    attributes.removeNamedItem(attr.name)
  }
}

export function mergeAttr(element: Element, attr: Dict<string>) {
  for (const name in attr) {
    const value = attr[name]

    element.setAttribute(name, value)
  }
}
