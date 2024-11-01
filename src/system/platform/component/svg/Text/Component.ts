import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  value?: string
  x?: string
  y?: string
  dx?: string
  dy?: string
  textAnchor?: string
}

export default class SVGText extends Element<SVGTextElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      style = {},
      className,
      value,
      x,
      y,
      dx,
      dy,
      textAnchor = 'start',
    } = this.$props

    const DEFAULT_STYLE = $system.style['text']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'text'
    )

    if (className) {
      $element.classList.add(className)
    }
    if (value !== undefined) {
      $element.textContent = value
    }
    if (x !== undefined) {
      $element.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      $element.setAttribute('y', `${y}`)
    }
    if (dx !== undefined) {
      $element.setAttribute('dx', `${dx}`)
    }
    if (dy !== undefined) {
      $element.setAttribute('dy', `${dy}`)
    }
    if (textAnchor !== undefined) {
      $element.setAttribute('text-anchor', textAnchor)
    }

    this.$element = $element

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      value: (value: string | undefined = '') => {
        this.$element.textContent = value
      },
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
      dx: (dx: number | undefined = 0) => {
        this.$element.setAttribute('dx', `${dx}`)
      },
      dy: (dy: number | undefined = 0) => {
        this.$element.setAttribute('dy', `${dy}`)
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
