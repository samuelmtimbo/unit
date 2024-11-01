import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler, svgPropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
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

export default class SVGForeignObject extends Element<
  SVGForeignObjectElement,
  Props
> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      x = 0,
      y = 0,
      width = 100,
      height = 100,
    } = this.$props

    const DEFAULT_STYLE = $system.style['foreignobject']

    const $element = this.$system.api.document.createElementNS(
      namespaceURI,
      'foreignObject'
    )
    if (className !== undefined) {
      $element.classList.value = className
    }
    $element.setAttribute('x', `${x}`)
    $element.setAttribute('y', `${y}`)
    $element.setAttribute('width', `${width}`)
    $element.setAttribute('height', `${height}`)

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    this.$element = $element

    this._prop_handler = {
      ...svgPropHandler(this, this.$element, DEFAULT_STYLE),
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

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
