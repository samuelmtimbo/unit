import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
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
}

export default class SVGSVG extends SVGElement_<SVGSVGElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'svg'),
      $system.style['svg'],
      {
        stroke: 'currentcolor',
        'stroke-width': '0',
        preserveAspectRatio: 'xMidYMid meet',
      },
      {
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
    )

    const { className, viewBox } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }
    if (viewBox) {
      this.$element.setAttribute('viewBox', viewBox)
    }
  }
}
