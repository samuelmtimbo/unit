import applyStyle from '../../../../../client/applyStyle'
import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler } from '../../../../../client/propHandler'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Style } from '../../../Props'

export interface Props {
  id?: string
  className?: string
  style?: Style
  d?: string
  markerStart?: string
  markerEnd?: string
  fillRule?: string
}

export const DEFAULT_STYLE = {
  strokeWidth: '3px',
  fill: 'none',
  stroke: 'currentColor',
}

// M 50,50 A 30 30 6 1 0 50,49.9
// M 10,50 L50,90 L90,50 L50,10 Z

export default class SVGPath extends Element<SVGPathElement, Props> {
  private _path_el: SVGPathElement

  private _prop_handler: PropHandler = {
    className: (className: string | undefined) => {
      this._path_el.className.value = className
    },
    style: (style: Style | undefined) => {
      applyStyle(this._path_el, { ...DEFAULT_STYLE, ...style })
    },
    d: (d: string | undefined) => {
      if (d === undefined) {
        this._path_el.removeAttribute('d')
      } else {
        this._path_el.setAttribute('d', d)
      }
    },
    markerStart: (markerStart: string | undefined) => {
      this._path_el.setAttribute('marker-start', markerStart)
    },
    markerEnd: (markerEnd: string | undefined) => {
      this._path_el.setAttribute('marker-end', markerEnd)
    },
    strokeWidth: (strokeWidth: string | undefined) => {
      if (strokeWidth === undefined) {
        this._path_el.removeAttribute('stroke-width')
      } else {
        this._path_el.setAttribute('stroke-width', `${strokeWidth}`)
      }
    },
    fillRule: (fillRule: string | undefined) => {
      if (fillRule === undefined) {
        this._path_el.removeAttribute('fill-rule')
      } else {
        this._path_el.setAttribute('fill-rule', fillRule)
      }
    },
  }

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      id,
      className,
      style = {},
      d = '',
      markerStart,
      markerEnd,
      fillRule,
    } = $props

    const path_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'path'
    )
    if (id !== undefined) {
      path_el.id = id
    }
    if (className) {
      path_el.classList.value = className
    }
    applyStyle(path_el, { ...DEFAULT_STYLE, ...style })
    path_el.setAttribute('d', d)
    if (markerStart !== undefined) {
      path_el.setAttribute('marker-start', markerStart)
    }
    if (markerEnd !== undefined) {
      path_el.setAttribute('marker-end', markerEnd)
    }
    if (fillRule !== undefined) {
      path_el.setAttribute('fill-rule', fillRule)
    }
    this._path_el = path_el

    this.$element = path_el
    this.$unbundled = false
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
