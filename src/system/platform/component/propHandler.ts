import applyAttr from '../../../client/applyAttr'
import applyStyle from '../../../client/applyStyle'
import { Dict } from '../../../types/Dict'
import { Style } from '../Props'

export type Handler = (value: any) => void

export type PropHandler = Dict<Handler>

export function attrHandler(element: HTMLElement, name: string): Handler {
  return (data: any) => {
    if (data === undefined) {
      element.removeAttribute(name)
    } else {
      element.setAttribute(name, data)
    }
  }
}

export function basePropHandler(
  element: HTMLElement,
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
    innerText: (innerText: string | undefined) => {
      element.innerText = innerText || ''
    },
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
