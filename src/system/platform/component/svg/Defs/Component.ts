import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import {
  htmlPropHandler,
  PropHandler,
  svgPropHandler,
} from '../../../../../client/propHandler'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
}

export default class SVGDefs extends Element<SVGDefsElement, Props> {
  private _defs_el: SVGDefsElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {}, className } = this.$props

    const defs_el = document.createElementNS(namespaceURI, 'defs')
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
