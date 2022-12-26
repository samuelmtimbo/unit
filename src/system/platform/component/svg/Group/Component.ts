import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import applyStyle from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
}

export default class SVGG extends Element<SVGGElement, Props> {
  private _g_el: SVGGElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {} } = this.$props

    const g_el = this.$system.api.document.createElementNS(namespaceURI, 'g')
    if (className !== undefined) {
      g_el.classList.value = className
    }
    applyStyle(g_el, style)

    this._g_el = g_el

    this.$element = g_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._g_el, current)
    }
  }
}
