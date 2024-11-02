import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { SVGElement_ } from '../../../../../client/svg'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  value?: string
  x?: string
  y?: string
  dx?: string
  dy?: string
  textAnchor?: string
}

export default class SVGText extends SVGElement_<SVGTextElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElementNS(namespaceURI, 'text'),
      $system.style['text']
    )

    const { className, value, x, y, dx, dy, textAnchor = 'start' } = this.$props

    if (className) {
      this.$element.classList.add(className)
    }
    if (value !== undefined) {
      this.$element.textContent = value
    }
    if (x !== undefined) {
      this.$element.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      this.$element.setAttribute('y', `${y}`)
    }
    if (dx !== undefined) {
      this.$element.setAttribute('dx', `${dx}`)
    }
    if (dy !== undefined) {
      this.$element.setAttribute('dy', `${dy}`)
    }
    if (textAnchor !== undefined) {
      this.$element.setAttribute('text-anchor', textAnchor)
    }

    this.$propHandler = {
      ...this.$propHandler,
      value: (value: string | undefined = '') => {
        this.$element.textContent = value
      },
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
      dx: (dx: number | undefined = 0) => {
        this.$element.setAttribute('dx', `${dx}`)
      },
      dy: (dy: number | undefined = 0) => {
        this.$element.setAttribute('dy', `${dy}`)
      },
    }
  }
}
