import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import applyAttr from './applyAttr'
import applyStyle from './applyStyle'

export type Handler = (value: any) => void

export type PropHandler = Dict<Handler>

export function attrHandler(
  element: HTMLElement | SVGElement,
  name: string
): Handler {
  return (data: any) => {
    if (data === undefined) {
      element.removeAttribute(name)
    } else {
      element.setAttribute(name, data)
    }
  }
}

export function htmlPropHandler(
  element: HTMLElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(element, DEFAULT_STYLE),
    innerText: (innerText: string | undefined) => {
      element.innerText = innerText || ''
    },
  }
}

export function svgPropHandler(
  element: SVGElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(element, DEFAULT_STYLE),
  }
}

export function basePropHandler(
  element: HTMLElement | SVGElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    attr: (attr) => {
      applyAttr(element, attr)
    },
    style: (style: Dict<string> | undefined = {}) => {
      applyStyle(element, { ...DEFAULT_STYLE, ...style })
    },
    className: attrHandler(element, 'className'),
    id: attrHandler(element, 'id'),
    tabIndex: attrHandler(element, 'tabIndex'),
    title: attrHandler(element, 'title'),
    draggable: attrHandler(element, 'draggable'),
  }
}

export function inputPropHandler(
  element: HTMLElement,
  VALUE_NAME: string,
  DEFAULT_VALUE: any
): PropHandler {
  return {
    value: (value: any | undefined) => {
      element[VALUE_NAME] = value || DEFAULT_VALUE
    },
    disabled: attrHandler(element, 'disabled'),
  }
}
