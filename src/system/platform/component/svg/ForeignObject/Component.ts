import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  width?: number
  height?: number
}

export default class SVGForeignObject extends Element<
  SVGForeignObjectElement,
  Props
> {
  private _foreign_el: SVGForeignObjectElement

  constructor($props: Props) {
    super($props)

    const {
      className,
      style = {},
      x = 0,
      y = 0,
      width = 100,
      height = 100,
    } = this.$props

    const foreign_el = document.createElementNS(namespaceURI, 'foreignObject')
    if (className !== undefined) {
      foreign_el.classList.value = className
    }
    foreign_el.setAttribute('x', `${x}`)
    foreign_el.setAttribute('y', `${y}`)
    foreign_el.setAttribute('width', `${width}`)
    foreign_el.setAttribute('height', `${height}`)
    applyStyle(foreign_el, style)

    this._foreign_el = foreign_el

    this.$element = foreign_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._foreign_el, current)
    } else if (prop === 'x') {
      this._foreign_el.setAttribute('x', `${current}`)
    } else if (prop === 'y') {
      this._foreign_el.setAttribute('y', `${current}`)
    } else if (prop === 'width') {
      this._foreign_el.setAttribute('width', `${current}`)
    } else if (prop === 'height') {
      this._foreign_el.setAttribute('height', `${current}`)
    }
  }
}
