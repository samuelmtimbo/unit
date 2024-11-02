import { mergeAttr } from '../../../../../client/attr'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  attr?: Dict<string>
  width?: number | string
  height?: number | string
  stroke?: string
  strokeWidth?: number
  preserveAspectRatio?: string
  viewBox?: string
  title?: string
  tabIndex?: number
}

export default class SVGSVG extends Element<SVGSVGElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      attr = {},
      stroke = 'currentColor',
      strokeWidth = 0,
      viewBox,
      preserveAspectRatio = 'none',
      title,
      tabIndex = -1,
    } = $props

    const DEFAULT_STYLE = $system.style['svg']

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

    mergeAttr(svg_el, attr)

    this.$element = svg_el

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      viewBox: (viewBox: string | undefined) => {
        if (viewBox === undefined) {
          this.$element.removeAttribute('viewBox')
        } else {
          this.$element.setAttribute('viewBox', viewBox)
        }
      },
      width: (width: number | undefined) => {
        if (width === undefined) {
          this.$element.removeAttribute('width')
        } else {
          this.$element.setAttribute('width', `${width}`)
        }
      },
      height: (height: number | undefined) => {
        if (height === undefined) {
          this.$element.removeAttribute('height')
        } else {
          this.$element.setAttribute('height', `${height}`)
        }
      },
      strokeWidth: (strokeWidth: number | undefined) => {
        if (strokeWidth === undefined) {
          this.$element.removeAttribute('stroke-width')
        } else {
          this.$element.setAttribute('stroke-width', `${strokeWidth}`)
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
