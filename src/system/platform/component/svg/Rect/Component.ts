import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  rx?: number
  ry?: number
  width?: number
  height?: number
  attr?: Dict<any>
}

export const DEFAULT_ATTR = {
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  rx: 0,
  ry: 0,
}

export default class SVGRect extends SVGElement_<SVGRectElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'rect'),
      $system.style['rect'],
      {},
      {
        x: (x: number | undefined = this.$props.attr.x ?? DEFAULT_ATTR.x) => {
          this.$element.setAttribute('x', `${x}`)
        },
        y: (y: number | undefined = this.$props.attr.y ?? DEFAULT_ATTR.y) => {
          this.$element.setAttribute('y', `${y}`)
        },
        width: (
          width: number | undefined = this.$props.attr.width ??
            DEFAULT_ATTR.width
        ) => {
          this.$element.setAttribute('width', `${width}`)
        },
        height: (
          height: number | undefined = this.$props.attr.height ??
            DEFAULT_ATTR.height
        ) => {
          this.$element.setAttribute('height', `${height}`)
        },
        rx: (
          rx: number | undefined = this.$props.attr.rx ?? DEFAULT_ATTR.rx
        ) => {
          this.$element.setAttribute('rx', `${rx}`)
        },
        ry: (
          ry: number | undefined = this.$props.attr.ry ?? DEFAULT_ATTR.ry
        ) => {
          this.$element.setAttribute('ry', `${ry}`)
        },
      }
    )

    const {
      className,
      x = DEFAULT_ATTR.x,
      y = DEFAULT_ATTR.y,
      rx = DEFAULT_ATTR.rx,
      ry = DEFAULT_ATTR.ry,
      width = DEFAULT_ATTR.width,
      height = DEFAULT_ATTR.height,
    } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }

    this.$element.setAttribute('x', `${x}`)
    this.$element.setAttribute('y', `${y}`)
    this.$element.setAttribute('rx', `${rx}`)
    this.$element.setAttribute('ry', `${ry}`)
    this.$element.setAttribute('width', `${width}`)
    this.$element.setAttribute('height', `${height}`)
  }
}
