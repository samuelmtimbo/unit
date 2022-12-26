import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import applyStyle from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  r?: number
}

export const DEFAULT_STYLE = {
  fill: 'currentColor',
  stroke: 'currentColor',
  strokeWidth: '1px',
}

export default class SVGCircle extends Element<SVGCircleElement, Props> {
  private _circle_el: SVGCircleElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, x = 50, y = 50, r = 50 } = $props

    const circle_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'circle'
    )

    if (className !== undefined) {
      circle_el.classList.value = className
    }

    applyStyle(circle_el, { ...DEFAULT_STYLE, ...style })

    circle_el.setAttribute('cx', `${x}`)
    circle_el.setAttribute('cy', `${y}`)
    circle_el.setAttribute('r', `${r}`)

    this._circle_el = circle_el

    this.$element = circle_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._circle_el.className.value = current
    } else if (prop === 'style') {
      applyStyle(this._circle_el, current)
    } else if (prop === 'x') {
      this._circle_el.setAttribute('cx', `${current}`)
    } else if (prop === 'y') {
      this._circle_el.setAttribute('cy', `${current}`)
    } else if (prop === 'r') {
      this._circle_el.setAttribute('r', `${current}`)
    }
  }
}
