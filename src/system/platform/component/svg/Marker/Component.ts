import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  markerHeight?: number
  markerWidth?: number
  refX?: number
  refY?: number
  orient?: string
}

export const DEFAULT_STYLE = {}

export default class SVGMarker extends Element<SVGMarkerElement, Props> {
  private _marker_el: SVGMarkerElement

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      id,
      style = {},
      className,
      markerHeight,
      markerWidth,
      refX,
      refY,
      orient,
    } = this.$props

    const marker_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'marker'
    )
    applyStyle(marker_el, style)
    if (id !== undefined) {
      marker_el.id = id
    }
    if (className) {
      marker_el.classList.add(className)
    }
    if (markerHeight !== undefined) {
      marker_el.setAttribute('markerHeight', `${markerHeight}`)
    }
    if (markerWidth !== undefined) {
      marker_el.setAttribute('markerWidth', `${markerWidth}`)
    }
    if (refX !== undefined) {
      marker_el.setAttribute('refX', `${refX}`)
    }
    if (refY !== undefined) {
      marker_el.setAttribute('refY', `${refY}`)
    }
    if (orient !== undefined) {
      marker_el.setAttribute('orient', orient)
    }
    this._marker_el = marker_el

    this.$element = marker_el

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
