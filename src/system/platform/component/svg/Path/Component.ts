import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
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

export default class SVGPath extends SVGElement_<SVGPathElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'path'),
      $system.style['path']
    )

    const { id, className, d = '', markerStart, markerEnd, fillRule } = $props

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className) {
      this.$element.classList.value = className
    }
    if (markerStart !== undefined) {
      this.$element.setAttribute('marker-start', markerStart)
    }
    if (markerEnd !== undefined) {
      this.$element.setAttribute('marker-end', markerEnd)
    }
    if (fillRule !== undefined) {
      this.$element.setAttribute('fill-rule', fillRule)
    }

    this.$element.setAttribute('d', d)

    this.$propHandler = {
      ...this.$propHandler,
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
}
