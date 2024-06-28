import { Dict } from '../types/Dict'
import { camelToDashed } from './id'

export default function applyAttr(element: Element, attr: Dict<string>) {
  removeAllAttr(element)
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

    element.setAttribute(camelToDashed(name), value)
  }
}
