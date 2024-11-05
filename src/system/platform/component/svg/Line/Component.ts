import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

export default class SVGLine extends SVGElement_<SVGLineElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'line'),
      $system.style['line'],
      {},
      {
        x1: (x1: number | undefined = 0) => {
          this.$element.setAttribute('x1', `${x1}`)
        },
        y1: (y1: number | undefined = 0) => {
          this.$element.setAttribute('y1', `${y1}`)
        },
        x2: (x2: number | undefined = 0) => {
          this.$element.setAttribute('x2', `${x2}`)
        },
        y2: (y2: number | undefined = 0) => {
          this.$element.setAttribute('y2', `${y2}`)
        },
      }
    )

    const { className, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }

    this.$element.setAttribute('x1', `${x1}`)
    this.$element.setAttribute('y1', `${y1}`)
    this.$element.setAttribute('x2', `${x2}`)
    this.$element.setAttribute('y2', `${y2}`)
  }
}
