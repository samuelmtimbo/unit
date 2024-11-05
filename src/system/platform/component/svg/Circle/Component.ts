import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  r?: number
}

export default class SVGCircle extends SVGElement_<SVGCircleElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'circle'),
      $system.style['circle'],
      {},
      {
        x: (x: number | undefined = 0) => {
          this.$element.setAttribute('cx', `${x}`)
        },
        y: (y: number | undefined = 0) => {
          this.$element.setAttribute('cy', `${y}`)
        },
        r: (r: number | undefined = 0) => {
          this.$element.setAttribute('r', `${r}`)
        },
      }
    )

    const { className, x = 50, y = 50, r = 50 } = $props

    if (className !== undefined) {
      this.$element.classList.value = className
    }

    this.$element.setAttribute('cx', `${x}`)
    this.$element.setAttribute('cy', `${y}`)
    this.$element.setAttribute('r', `${r}`)
  }
}
