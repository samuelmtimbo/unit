import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  href?: string
  className?: string
  style?: Dict<string>
}

export default class SVGUse extends Element<SVGGElement, Props> {
  private _use_el: SVGGElement

  constructor($props: Props) {
    super($props)

    const { className, style = {}, href } = this.$props

    const use_el = document.createElementNS(namespaceURI, 'use')
    if (className !== undefined) {
      use_el.classList.value = className
    }
    if (href !== undefined) {
      use_el.setAttributeNS(namespaceURI, 'xlink:href', href)
      use_el.setAttribute('href', href)
    }
    applyStyle(use_el, style)

    this._use_el = use_el

    this.$element = use_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._use_el, current)
    } else if (prop === 'href') {
      if (current) {
        this._use_el.setAttributeNS(namespaceURI, 'xlink:href', current)
        this._use_el.setAttribute('href', current)
      } else {
        this._use_el.removeAttributeNS(namespaceURI, 'xlink:href')
        this._use_el.removeAttribute('href')
      }
    }
  }
}
