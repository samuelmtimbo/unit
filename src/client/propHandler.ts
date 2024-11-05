import { Style } from '../system/platform/Style'
import { Dict } from '../types/Dict'
import { identity } from '../util/identity'
import { applyAttr } from './attr'
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

export function elementPropHandler<T extends HTMLElement | SVGElement>(
  component: Component<T>,
  element: T,
  DEFAULT_STYLE: Style,
  DEFAULT_ATTR: Dict<any>,
  CONTROLLED_ATTR_SET: Set<string>
): PropHandler {
  return {
    ...basePropHandler(
      component,
      element,
      DEFAULT_STYLE,
      DEFAULT_ATTR,
      CONTROLLED_ATTR_SET
    ),
    ...stylePropHandler(component, element, DEFAULT_STYLE),
  }
}

export function htmlPropHandler<T extends HTMLElement>(
  component: Component<T>,
  element: T,
  DEFAULT_STYLE: Style,
  DEFAULT_ATTR: Dict<any>,
  CONTROLLED_ATTR_SET: Set<string>
): PropHandler {
  return {
    ...elementPropHandler(
      component,
      element,
      DEFAULT_STYLE,
      DEFAULT_ATTR,
      CONTROLLED_ATTR_SET
    ),
    innerText: (innerText: string | undefined) => {
      element.innerText = innerText || ''
    },
  }
}

export function svgPropHandler<P extends Dict<any> = any>(
  component: Component<SVGElement, P>,
  element: SVGElement,
  DEFAULT_STYLE: Style,
  DEFAULT_ATTR: Dict<any>,
  CONTROLLED_ATTR_SET: Set<string>
): PropHandler {
  return {
    ...basePropHandler(
      component,
      element,
      DEFAULT_STYLE,
      DEFAULT_ATTR,
      CONTROLLED_ATTR_SET
    ),
    ...stylePropHandler(component, element, DEFAULT_STYLE),
  }
}

export function basePropHandler(
  component: Component,
  element: HTMLElement | SVGElement,
  DEFAULT_STYLE: Style,
  DEFAULT_ATTR: Dict<any>,
  CONTROLLED_ATTR_SET: Set<string>
): PropHandler {
  return {
    attr: (attr) => {
      applyAttr(
        element,
        { ...DEFAULT_ATTR, ...attr },
        component.getProp('attr'),
        CONTROLLED_ATTR_SET
      )
    },
    style: (style: Dict<string> | undefined = {}) => {
      applyStyle(element, { ...DEFAULT_STYLE, ...style })
    },
    name: makeAttrHandler(element, 'name'),
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
  DEFAULT_VALUE: any,
  parseValue: (value: string) => string = identity
): PropHandler {
  return {
    value: (value: any | undefined) => {
      const value_ = parseValue(value)

      element[VALUE_NAME] = value_ || DEFAULT_VALUE
    },
    min: (value: any | undefined) => {
      element[VALUE_NAME] = value
    },
    max: (value: any | undefined) => {
      element[VALUE_NAME] = value
    },
    placeholder: (placeholder: string | undefined) => {
      // @ts-ignore
      element.placeholder = placeholder ?? ''
    },
    disabled: makeAttrHandler(element, 'disabled'),
  }
}
