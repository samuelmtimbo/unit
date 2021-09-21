import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  href?: string
  startOffset?: string
  spacing?: string
  lenghtAdjust?: string
  textContent?: string
}

export default class SVGTextPath extends Element<SVGTextPathElement, Props> {
  private _text_path_el: SVGTextPathElement

  constructor($props: Props) {
    super($props)

    const {
      style = {},
      className,
      href,
      startOffset,
      lenghtAdjust,
      spacing,
      textContent,
    } = this.$props

    const text_path_el = document.createElementNS(namespaceURI, 'textPath')
    applyStyle(text_path_el, style)
    if (className) {
      text_path_el.classList.add(className)
    }
    if (href !== undefined) {
      text_path_el.setAttribute('href', href)
    }
    if (startOffset !== undefined) {
      text_path_el.setAttribute('startOffset', startOffset)
    }
    if (lenghtAdjust !== undefined) {
      text_path_el.setAttribute('lenghtAdjust', lenghtAdjust)
    }
    if (spacing !== undefined) {
      text_path_el.setAttribute('spacing', spacing)
    }
    if (textContent !== undefined) {
      text_path_el.textContent = textContent
    }
    this._text_path_el = text_path_el

    this.$element = text_path_el
  }

  // TODO
  onPropChanged(prop: string, current: any): void {
    if (prop === 'textContent') {
      this._text_path_el.textContent = current
    }
  }
}
