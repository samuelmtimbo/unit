import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

export default class SVGLine extends Element<SVGLineElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = $props

    const DEFAULT_STYLE = $system.style['use']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'line'
    )

    if (className !== undefined) {
      $element.classList.value = className
    }

    $element.setAttribute('x1', `${x1}`)
    $element.setAttribute('y1', `${y1}`)
    $element.setAttribute('x2', `${x2}`)
    $element.setAttribute('y2', `${y2}`)

    this.$element = $element

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      x1: (x1: number | undefined = 0) => {
        this.$element.setAttribute('x1', `${x1}`)
      },
      y1: (y1: number | undefined = 0) => {
        this.$element.setAttribute('y1', `${y1}`)
      },
      x2: (x2: number | undefined = 0) => {
        this.$element.setAttribute('x2', `${x2}`)
      },
      y2: (y2: number | undefined = 0) => {
        this.$element.setAttribute('y2', `${y2}`)
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
