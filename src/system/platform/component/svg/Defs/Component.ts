import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
}

export default class SVGDefs extends Element<SVGDefsElement, Props> {
  private _defs_el: SVGDefsElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {}, className } = this.$props

    const defs_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'defs'
    )
    applyStyle(defs_el, style)
    if (className) {
      defs_el.classList.add(className)
    }
    this._defs_el = defs_el

    this.$element = defs_el

    this._prop_handler = svgPropHandler(defs_el, {})
  }

  onPropChanged(name: string, current: any): void {
    this._prop_handler[name](current)
  }
}
