import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  rx?: number
  ry?: number
}

export default class SVGEllipse extends Element<SVGCircleElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, x = 50, y = 50, rx = 50, ry = 50 } = $props

    const DEFAULT_STYLE = $system.style['ellipse']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'circle'
    )

    if (className !== undefined) {
      $element.classList.value = className
    }

    $element.setAttribute('cx', `${x}`)
    $element.setAttribute('cy', `${y}`)
    $element.setAttribute('rx', `${rx}`)
    $element.setAttribute('ry', `${ry}`)

    this.$element = $element

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      x: (x: number | undefined = 0) => {
        this.$element.setAttribute('x', `${x}`)
      },
      y: (y: number | undefined = 0) => {
        this.$element.setAttribute('y', `${y}`)
      },
      rx: (rx: number | undefined = 0) => {
        this.$element.setAttribute('rx', `${rx}`)
      },
      ry: (ry: number | undefined = 0) => {
        this.$element.setAttribute('ry', `${ry}`)
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
