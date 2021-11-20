import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
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
  private _line_el: SVGLineElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = $props

    const line_el = document.createElementNS(namespaceURI, 'line')
    if (className !== undefined) {
      line_el.classList.value = className
    }
    applyStyle(line_el, style)
    line_el.setAttribute('x1', `${x1}`)
    line_el.setAttribute('y1', `${y1}`)
    line_el.setAttribute('x2', `${x2}`)
    line_el.setAttribute('y2', `${y2}`)
    this._line_el = line_el

    this.$element = line_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._line_el.className.value = current
    } else if (prop === 'style') {
      applyStyle(this._line_el, current)
    } else if (
      prop === 'x1' ||
      prop === 'y1' ||
      prop === 'x2' ||
      prop === 'y2'
    ) {
      this._line_el.setAttribute(prop, `${current}`)
    }
  }
}
