import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  width?: number | string
  height?: number | string
  stroke?: string
  strokeWidth?: number
  preserveAspectRatio?: string
  viewBox?: string
  title?: string
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class SVGSVG extends Element<SVGSVGElement, Props> {
  private _svg_el: SVGSVGElement

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      className,
      style = {},
      width,
      height,
      stroke = 'currentColor',
      strokeWidth = 0,
      viewBox,
      preserveAspectRatio = 'none',
      title,
      tabIndex,
    } = $props

    const svg_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'svg'
    )

    if (className !== undefined) {
      svg_el.classList.value = className
    }
    if (viewBox) {
      svg_el.setAttribute('viewBox', viewBox)
    }
    if (preserveAspectRatio) {
      svg_el.setAttribute('preserveAspectRatio', preserveAspectRatio)
    }
    if (width !== undefined) {
      svg_el.setAttribute('width', `${width}`)
    }
    if (height !== undefined) {
      svg_el.setAttribute('height', `${height}`)
    }
    if (tabIndex !== undefined) {
      svg_el.tabIndex = tabIndex
    }
    if (stroke !== undefined) {
      svg_el.setAttribute('stroke', `${stroke}`)
    }
    if (strokeWidth !== undefined) {
      svg_el.setAttribute('stroke-width', `${strokeWidth}`)
    }
    if (title) {
      const title_el = this.$system.api.document.createElementNS(
        namespaceURI,
        'title'
      )
      title_el.innerHTML = title
      svg_el.appendChild(title_el)
    }
    svg_el.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    applyStyle(svg_el, { ...DEFAULT_STYLE, ...style })
    this._svg_el = svg_el

    this.$element = svg_el
    this.$unbundled = false
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._svg_el.className.value = current
    } else if (prop === 'style') {
      applyStyle(this._svg_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'viewBox') {
      if (current === undefined) {
        this._svg_el.removeAttribute('viewBox')
      } else {
        this._svg_el.setAttribute('viewBox', current)
      }
    } else if (prop === 'width') {
      if (current === undefined) {
        this._svg_el.removeAttribute('width')
      } else {
        this._svg_el.setAttribute('width', `${current}`)
      }
    } else if (prop === 'height') {
      this._svg_el.setAttribute('height', `${current}`)
    } else if (prop === 'strokeWidth') {
      if (current === undefined) {
        this._svg_el.removeAttribute('stroke-width')
      } else {
        this._svg_el.setAttribute('stroke-width', `${current}`)
      }
    } else if (prop === 'tabIndex') {
      this._svg_el.tabIndex = current
    }
  }
}
