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
  width?: number
  height?: number
}

export default class SVGRect extends Element<SVGRectElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      width = 100,
      height = 100,
    } = $props

    const DEFAULT_STYLE = $system.style['rect']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'rect'
    )

    if (className !== undefined) {
      $element.classList.value = className
    }

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    $element.setAttribute('x', `${x}`)
    $element.setAttribute('y', `${y}`)
    $element.setAttribute('rx', `${rx}`)
    $element.setAttribute('ry', `${ry}`)
    $element.setAttribute('width', `${width}`)
    $element.setAttribute('height', `${height}`)

    this.$element = $element

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      x: (x: number | undefined = 0) => {
        this.$element.setAttribute('x', `${x}`)
      },
      y: (y: number | undefined = 0) => {
        this.$element.setAttribute('y', `${y}`)
      },
      width: (width: number | undefined = 0) => {
        this.$element.setAttribute('width', `${width}`)
      },
      height: (height: number | undefined = 0) => {
        this.$element.setAttribute('height', `${height}`)
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
