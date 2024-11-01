import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  href?: string
  className?: string
  style?: Dict<string>
}

export default class SVGUse extends Element<SVGGElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, href } = this.$props

    const DEFAULT_STYLE = $system.style['use']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'use'
    )
    if (className !== undefined) {
      $element.classList.value = className
    }
    if (href !== undefined) {
      $element.setAttributeNS(namespaceURI, 'xlink:href', href)
      $element.setAttribute('href', href)
    }

    this.$element = $element

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      href: (href: string | undefined) => {
        if (href) {
          this.$element.setAttributeNS(namespaceURI, 'xlink:href', href)
          this.$element.setAttribute('href', href)
        } else {
          this.$element.removeAttributeNS(namespaceURI, 'xlink:href')
          this.$element.removeAttribute('href')
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
