import SVGCircle from '../../../system/platform/component/svg/Circle/Component'
import SVGRect from '../../../system/platform/component/svg/Rect/Component'
import SVGSVG from '../../../system/platform/component/svg/SVG/Component'
import { Element } from '../../element'
import parentElement from '../../parentElement'
import mergeStyle from '../mergeStyle'

export interface Props {
  className?: string
  style?: any
  width?: number
  height?: number
  shape?: 'circle' | 'rect'
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: number
  strokeDashOffset?: number
}

export default class Selection extends Element<HTMLDivElement, Props> {
  private _selection: SVGSVG
  private _selection_shape: SVGCircle | SVGRect

  constructor($props: Props) {
    super($props)

    const {
      width = 0,
      height = 0,
      stroke = 'currentColor',
      strokeWidth = 1,
    } = this.$props

    const selection_shape = this._render_selection_shape()
    this._selection_shape = selection_shape

    const selection = new SVGSVG({
      className: 'selection',
      style: {
        position: 'absolute',
        width: `${width + strokeWidth}px`,
        height: `${height + strokeWidth}px`,
        fill: 'none',
        pointerEvents: 'none',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        stroke,
      },
    })
    selection.appendChild(selection_shape)
    this._selection = selection

    const $element = parentElement()

    this.$element = $element
    this.$slot = selection.$slot

    this.registerRoot(selection)
  }

  private _render_selection_shape = (): SVGCircle | SVGRect => {
    const {
      width = 0,
      height = 0,
      shape = 'rect',
      stroke = 'currentColor',
      strokeWidth = 1,
      strokeDasharray = 6,
      strokeDashOffset = 0,
    } = this.$props

    const x = 0.5 * strokeWidth
    const y = 0.5 * strokeWidth

    let selection_shape: SVGRect | SVGCircle
    if (shape === 'circle') {
      selection_shape = new SVGCircle({
        x: width / 2 + x,
        y: height / 2 + y,
        r: width / 2,
        style: {
          strokeDasharray: `${strokeDasharray}`,
          strokeWidth: `${strokeWidth}`,
          strokeDashoffset: `${strokeDashOffset}`,
        },
      })
    } else {
      selection_shape = new SVGRect({
        width,
        height,
        x,
        y,
        style: {
          strokeDasharray: `${strokeDasharray}`,
          strokeWidth: `${strokeWidth}`,
          strokeDashOffset: `${strokeDashOffset}`,
        },
      })
    }

    return selection_shape
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'stroke') {
      mergeStyle(this._selection, {
        stroke: current,
      })
    } else if (prop === 'width') {
      const { shape, width, strokeWidth = 1 } = this.$props

      mergeStyle(this._selection, {
        width: `${width + strokeWidth}px`,
      })

      if (shape === 'circle') {
        this._selection_shape.setProp('x', width / 2 + 0.5 * strokeWidth)
        this._selection_shape.setProp('r', width / 2)
      } else {
        this._selection_shape.setProp('width', current)
      }
    } else if (prop === 'height') {
      const { shape, height, strokeWidth = 1 } = this.$props

      mergeStyle(this._selection, {
        height: `${height + strokeWidth}px`,
      })

      if (shape === 'circle') {
        this._selection_shape.setProp('y', height / 2 + 0.5 * strokeWidth)
      } else {
        this._selection_shape.setProp('height', current)
      }
    } else if (prop === 'strokeDasharray') {
      mergeStyle(this._selection_shape, {
        strokeDasharray: `${current}`,
      })
    } else if (prop === 'shape') {
      const selection_shape = this._render_selection_shape()
      this._selection_shape = selection_shape
      this._selection.setChildren([selection_shape])
    }
  }
}
