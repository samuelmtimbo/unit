import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import applyStyle from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
}

export default class SVGDefs extends Element<SVGDefsElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {}, className } = this.$props

    this.$element = this.$system.api.document.createElementNS(
      namespaceURI,
      'defs'
    )

    if (className) {
      this.$element.classList.add(className)
    }

    applyStyle(this.$element, style)

    this._prop_handler = svgPropHandler(this, {})
  }

  onPropChanged(name: string, current: any): void {
    this._prop_handler[name](current)
  }
}
