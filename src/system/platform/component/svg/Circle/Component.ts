import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  r?: number
}

export default class SVGCircle extends Element<SVGCircleElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, x = 50, y = 50, r = 50 } = $props

    const DEFAULT_STYLE = $system.style['circle']

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

    this.$element = circle_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this.$element.className.value = current
    } else if (prop === 'style') {
      applyStyle(this.$element, current)
    } else if (prop === 'x') {
      this.$element.setAttribute('cx', `${current}`)
    } else if (prop === 'y') {
      this.$element.setAttribute('cy', `${current}`)
    } else if (prop === 'r') {
      this.$element.setAttribute('r', `${current}`)
    }
  }
}
