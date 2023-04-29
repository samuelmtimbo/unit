import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import applyAttr from './applyAttr'
import { Component } from './component'
import applyStyle, { applyDynamicStyle } from './style'

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

export function elementPropHandler(
  component: Component<HTMLElement> | Component<SVGSVGElement>,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(component.$element, DEFAULT_STYLE),
    ...stylePropHandler(component, DEFAULT_STYLE),
  }
}

export function htmlPropHandler(
  component: Component<HTMLElement>,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...elementPropHandler(component, DEFAULT_STYLE),
    innerText: (innerText: string | undefined) => {
      component.$element.innerText = innerText || ''
    },
  }
}

export function svgPropHandler(
  component: Component<SVGElement>,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(component.$element, DEFAULT_STYLE),
    ...stylePropHandler(component, DEFAULT_STYLE),
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

export function stylePropHandler(
  component: Component<HTMLElement | SVGElement>,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    style: (style: Dict<string> | undefined = {}) => {
      applyDynamicStyle(component, { ...DEFAULT_STYLE, ...style })
    },
  }
}

export function inputPropHandler(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  VALUE_NAME: string,
  DEFAULT_VALUE: any
): PropHandler {
  return {
    value: (value: any | undefined) => {
      element[VALUE_NAME] = value || DEFAULT_VALUE
    },
    placeholder: (placeholder: string | undefined) => {
      // @ts-ignore
      element.placeholder = placeholder ?? ''
    },
    disabled: attrHandler(element, 'disabled'),
  }
}
