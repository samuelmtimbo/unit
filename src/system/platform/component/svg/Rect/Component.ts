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
}

export default class SVGRect extends SVGElement_<SVGRectElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'rect'),
      $system.style['rect']
    )

    const {
      className,
      x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      width = 100,
      height = 100,
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

    this.$propHandler = {
      ...this.$propHandler,
      x: (x: number | undefined = 0) => {
        this.$element.setAttribute('x', `${x}`)
      },
      y: (y: number | undefined = 0) => {
        this.$element.setAttribute('y', `${y}`)
      },
      width: (width: number | undefined = 0) => {
        this.$element.setAttribute('width', `${width}`)
      },
      height: (height: number | undefined = 0) => {
        this.$element.setAttribute('height', `${height}`)
      },
      rx: (rx: number | undefined = 0) => {
        this.$element.setAttribute('rx', `${rx}`)
      },
      ry: (ry: number | undefined = 0) => {
        this.$element.setAttribute('ry', `${ry}`)
      },
    }
  }
}
