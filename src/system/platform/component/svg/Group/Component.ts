import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
}

export default class SVGG extends Element<SVGGElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {} } = this.$props

    const DEFAULT_STYLE = $system.style['g']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'g'
    )

    if (className !== undefined) {
      $element.classList.value = className
    }

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this.$element = $element

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
