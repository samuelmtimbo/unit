import { Dict } from '../types/Dict'

export function removeAllAttributes(element: HTMLElement | SVGElement): void {
  const { attributes } = element

  for (let i = attributes.length - 1; i >= 0; i--) {
    element.removeAttribute(attributes[i].name)
  }
}

export function applyAttributes(
  element: HTMLElement | SVGElement,
  attr: Dict<string>
): void {
  for (const key in attr) {
    const a = attr[key]

    element.setAttribute(key, a)
  }
}

export function setAttributes(
  element: HTMLElement | SVGElement,
  attr: Dict<string>
): void {
  // removeAllAttributes(element)
  applyAttributes(element, attr)
}
