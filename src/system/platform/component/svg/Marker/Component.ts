import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
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

export default class SVGMarker extends SVGElement_<SVGMarkerElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'marker'),
      $system.style['marker'],
      {},
      {}
    )

    const { id, className, markerHeight, markerWidth, refX, refY, orient } =
      this.$props

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className) {
      this.$element.classList.add(className)
    }
    if (markerHeight !== undefined) {
      this.$element.setAttribute('markerHeight', `${markerHeight}`)
    }
    if (markerWidth !== undefined) {
      this.$element.setAttribute('markerWidth', `${markerWidth}`)
    }
    if (refX !== undefined) {
      this.$element.setAttribute('refX', `${refX}`)
    }
    if (refY !== undefined) {
      this.$element.setAttribute('refY', `${refY}`)
    }
    if (orient !== undefined) {
      this.$element.setAttribute('orient', orient)
    }
  }
}
