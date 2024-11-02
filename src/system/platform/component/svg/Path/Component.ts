import { applyAttr } from '../../../../../client/attr'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Style } from '../../../Style'

export interface Props {
  id?: string
  className?: string
  style?: Style
  d?: string
  markerStart?: string
  markerEnd?: string
  fillRule?: string
  attr?: Dict<string>
}

export default class SVGPath extends Element<SVGPathElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      id,
      className,
      style = {},
      d = '',
      markerStart,
      markerEnd,
      fillRule,
      attr = {},
    } = $props

    const DEFAULT_STYLE = $system.style['path']

    const path_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'path'
    )

    applyAttr(path_el, attr)

    if (id !== undefined) {
      path_el.id = id
    }
    if (className) {
      path_el.classList.value = className
    }
    if (markerStart !== undefined) {
      path_el.setAttribute('marker-start', markerStart)
    }
    if (markerEnd !== undefined) {
      path_el.setAttribute('marker-end', markerEnd)
    }
    if (fillRule !== undefined) {
      path_el.setAttribute('fill-rule', fillRule)
    }

    path_el.setAttribute('d', d)

    
    applyStyle(path_el, { ...DEFAULT_STYLE, ...style })

    this.$element = path_el

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
      d: (d: string | undefined) => {
        if (d === undefined) {
          this.$element.removeAttribute('d')
        } else {
          this.$element.setAttribute('d', d)
        }
      },
      markerStart: (markerStart: string | undefined) => {
        this.$element.setAttribute('marker-start', markerStart)
      },
      markerEnd: (markerEnd: string | undefined) => {
        this.$element.setAttribute('marker-end', markerEnd)
      },
      strokeWidth: (strokeWidth: string | undefined) => {
        if (strokeWidth === undefined) {
          this.$element.removeAttribute('stroke-width')
        } else {
          this.$element.setAttribute('stroke-width', `${strokeWidth}`)
        }
      },
      fillRule: (fillRule: string | undefined) => {
        if (fillRule === undefined) {
          this.$element.removeAttribute('fill-rule')
        } else {
          this.$element.setAttribute('fill-rule', fillRule)
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
