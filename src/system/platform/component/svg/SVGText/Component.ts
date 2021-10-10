import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  text?: string
  x?: number
  y?: number
  dx?: number
  dy?: number
  textAnchor?: string
}

export const DEFAULT_STYLE = {
  fill: 'currentColor',
}

export default class SVGText extends Element<SVGTextElement, Props> {
  private _text_el: SVGTextElement

  constructor($props: Props) {
    super($props)

    const {
      style = {},
      className,
      text,
      x,
      y,
      dx,
      dy,
      textAnchor,
    } = this.$props

    const text_el = document.createElementNS(namespaceURI, 'text')
    applyStyle(text_el, { ...DEFAULT_STYLE, ...style })
    if (className) {
      text_el.classList.add(className)
    }
    if (text !== undefined) {
      text_el.textContent = text
    }
    if (x !== undefined) {
      text_el.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      text_el.setAttribute('y', `${y}`)
    }
    if (dx !== undefined) {
      text_el.setAttribute('dx', `${dx}`)
    }
    if (dy !== undefined) {
      text_el.setAttribute('dy', `${dy}`)
    }
    if (textAnchor !== undefined) {
      text_el.setAttribute('text-anchor', textAnchor)
    }
    this._text_el = text_el

    this.$element = text_el
  }

  // TODO
  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._text_el, current)
    } else if (prop === 'text') {
      this._text_el.setAttribute('textContent', current)
    } else if (prop === 'dy') {
      this._text_el.setAttribute('dy', `${current}`)
    } else if (prop === 'dx') {
      this._text_el.setAttribute('dx', `${current}`)
    } else if (prop === 'x') {
      this._text_el.setAttribute('x', `${current}`)
    } else if (prop === 'y') {
      this._text_el.setAttribute('y', `${current}`)
    } else if (prop === 'textAnchor') {
      this._text_el.setAttribute('text-anchor', current)
    }
  }
}
