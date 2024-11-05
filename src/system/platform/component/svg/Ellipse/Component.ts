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
}

export default class SVGEllipse extends SVGElement_<SVGCircleElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'circle'),
      $system.style['ellipse'],
      {},
      {
        x: (x: number | undefined = 0) => {
          this.$element.setAttribute('x', `${x}`)
        },
        y: (y: number | undefined = 0) => {
          this.$element.setAttribute('y', `${y}`)
        },
        rx: (rx: number | undefined = 0) => {
          this.$element.setAttribute('rx', `${rx}`)
        },
        ry: (ry: number | undefined = 0) => {
          this.$element.setAttribute('ry', `${ry}`)
        },
      }
    )

    const { className, x = 50, y = 50, rx = 50, ry = 50 } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }

    this.$element.setAttribute('cx', `${x}`)
    this.$element.setAttribute('cy', `${y}`)
    this.$element.setAttribute('rx', `${rx}`)
    this.$element.setAttribute('ry', `${ry}`)
  }

  onPropChanged(prop: string, current: any): void {
    this.$propHandler[prop](current)
  }
}
