import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  x?: number
  y?: number
  width?: number
  height?: number
}

export default class SVGForeignObject extends SVGElement_<
  SVGForeignObjectElement,
  Props
> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'foreignObject'),
      $system.style['foreignobject']
    )

    const { className, x = 0, y = 0, width = 100, height = 100 } = this.$props

    if (className !== undefined) {
      this.$element.classList.value = className
    }

    this.$element.setAttribute('x', `${x}`)
    this.$element.setAttribute('y', `${y}`)
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
    }
  }
}
