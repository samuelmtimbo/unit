import { isFrameRelativeValue } from '../isFrameRelative'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { IOElement } from './IOElement'
import { LayoutNode } from './LayoutNode'

export function extractComponentAttr(
  component: Component,
  trait: LayoutNode
): Dict<string> {
  const attr = extractAttr(component.$element)

  if (component.$element instanceof HTMLCanvasElement) {
    let propWidth = component.getProp('width')
    let propHeight = component.getProp('height')

    if (typeof propWidth === 'number') {
      propWidth = propWidth + 'px'
    }
    if (typeof propHeight === 'number') {
      propHeight = propHeight + 'px'
    }

    if (isFrameRelativeValue(propWidth ?? '')) {
      attr['width'] = `${trait.width}px`
    }
    if (isFrameRelativeValue(propHeight ?? '')) {
      attr['height'] = `${trait.height}px`
    }
  }

  return attr
}

export function extractAttr(element: IOElement): Dict<string> {
  if (element instanceof Text) {
    return {}
  }

  const attr = {}

  for (let attribute of (element.attributes ?? [])) {
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
