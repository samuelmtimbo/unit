import { Style } from '../system/platform/Props'
import { Dict } from '../types/Dict'
import applyAttr from './applyAttr'
import { Component } from './component'
import { applyDynamicStyle, applyStyle } from './style'

export type Handler = (value: any) => void

export type PropHandler = Dict<Handler>

export function makeAttrHandler(
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
  element: HTMLElement | SVGSVGElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(component, element, DEFAULT_STYLE),
    ...stylePropHandler(component, element, DEFAULT_STYLE),
  }
}

export function htmlPropHandler(
  component: Component<HTMLElement>,
  element: HTMLElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...elementPropHandler(component, element, DEFAULT_STYLE),
    innerText: (innerText: string | undefined) => {
      element.innerText = innerText || ''
    },
  }
}

export function svgPropHandler(
  component: Component<SVGElement>,
  element: SVGElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    ...basePropHandler(component, element, DEFAULT_STYLE),
    ...stylePropHandler(component, element, DEFAULT_STYLE),
  }
}

export function basePropHandler(
  component: Component,
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
    className: makeAttrHandler(element, 'className'),
    id: makeAttrHandler(element, 'id'),
    tabIndex: makeAttrHandler(element, 'tabIndex'),
    title: makeAttrHandler(element, 'title'),
    draggable: makeAttrHandler(element, 'draggable'),
  }
}

export function stylePropHandler(
  component: Component<HTMLElement | SVGElement>,
  element: HTMLElement | SVGElement,
  DEFAULT_STYLE: Style
): PropHandler {
  return {
    style: (style: Dict<string> | undefined = {}) => {
      applyDynamicStyle(component, element, { ...DEFAULT_STYLE, ...style })
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
    disabled: makeAttrHandler(element, 'disabled'),
  }
}
