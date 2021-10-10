import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
}

export default class SVGDefs extends Element<SVGDefsElement, Props> {
  private _defs_el: SVGDefsElement

  constructor($props: Props) {
    super($props)

    const { style = {}, className } = this.$props

    const defs_el = document.createElementNS(namespaceURI, 'defs')
    applyStyle(defs_el, style)
    if (className) {
      defs_el.classList.add(className)
    }
    this._defs_el = defs_el

    this.$element = defs_el
  }

  // TODO
  onPropChanged(prop: string, current: any): void {}
}
