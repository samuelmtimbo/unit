import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
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
  private _rect_el: SVGRectElement

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      className,
      style = {},
      x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      width = 0,
      height = 0,
    } = $props

    const rect_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'rect'
    )
    if (className !== undefined) {
      rect_el.classList.value = className
    }
    applyStyle(rect_el, style)
    rect_el.setAttribute('x', `${x}`)
    rect_el.setAttribute('y', `${y}`)
    rect_el.setAttribute('rx', `${rx}`)
    rect_el.setAttribute('ry', `${ry}`)
    rect_el.setAttribute('width', `${width}`)
    rect_el.setAttribute('height', `${height}`)
    this._rect_el = rect_el

    this.$element = rect_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._rect_el.className.value = current
    } else if (prop === 'style') {
      applyStyle(this._rect_el, current)
    } else if (
      prop === 'x' ||
      prop === 'y' ||
      prop === 'rx' ||
      prop === 'ry' ||
      prop === 'width' ||
      prop === 'height'
    ) {
      this._rect_el.setAttribute(prop, `${current}`)
    }
  }
}
