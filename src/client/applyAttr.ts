import { Dict } from '../types/Dict'

export default function applyAttr(element: Element, attr: Dict<string>) {
  // removeAllAttr(element)
  mergeAttr(element, attr)
}

export function removeAllAttr(element: Element, attr: Dict<string>) {
  // TODO
}

export function mergeAttr(element: Element, attr: Dict<string>) {
  for (const name in attr) {
    const value = attr[name]
    element.setAttribute(name, value)
  }
}
