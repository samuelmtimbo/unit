import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import SVGCircle from '../../svg/Circle/Component'
import SVGRect from '../../svg/Rect/Component'
import SVGSVG from '../../svg/SVG/Component'

export interface Props {
  className?: string
  style?: any
  width?: number
  height?: number
  shape?: 'circle' | 'rect'
  x?: number
  y?: number
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  strokeDashOffset?: number
}

export default class Selection extends Element<HTMLDivElement, Props> {
  private _selection: SVGSVG
  private _selection_shape: SVGCircle | SVGRect

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      width = 0,
      height = 0,
      x = 0,
      y = 0,
      stroke = 'currentColor',
      strokeWidth = 1,
    } = this.$props

    const selection_shape = this._render_selection_shape()
    this._selection_shape = selection_shape

    const selection = new SVGSVG(
      {
        className: 'selection',
        style: {
          position: 'absolute',
          width: `${width + strokeWidth}px`,
          height: `${height + strokeWidth}px`,
          fill: 'none',
          pointerEvents: 'none',
          top: `calc(50% + ${y}px)`,
          left: `calc(50% + ${x}px)`,
          transform: 'translate(-50%, -50%)',
          stroke,
        },
      },
      this.$system,
      this.$pod
    )
    selection.appendChild(selection_shape)
    this._selection = selection

    const $element = parentElement($system)

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
      strokeDasharray = '6',
      strokeDashOffset = 0,
    } = this.$props

    const x = 0.5 * strokeWidth
    const y = 0.5 * strokeWidth

    let selection_shape: SVGRect | SVGCircle
    if (shape === 'circle') {
      selection_shape = new SVGCircle(
        {
          x: width / 2 + x,
          y: height / 2 + y,
          r: width / 2,
          style: {
            stroke: '',
            strokeDasharray,
            strokeWidth: `${strokeWidth}`,
            strokeDashoffset: `${strokeDashOffset}`,
          },
        },
        this.$system,
        this.$pod
      )
    } else {
      selection_shape = new SVGRect(
        {
          width,
          height,
          x,
          y,
          style: {
            stroke: '',
            strokeDasharray,
            strokeWidth: `${strokeWidth}`,
            strokeDashoffset: `${strokeDashOffset}`,
          },
        },
        this.$system,
        this.$pod
      )
    }

    return selection_shape
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'stroke') {
      mergePropStyle(this._selection, {
        stroke: current,
      })
    } else if (prop === 'width') {
      const { shape, width, strokeWidth = 1 } = this.$props

      mergePropStyle(this._selection, {
        width: `${width + strokeWidth}px`,
      })

      if (shape === 'circle') {
        const selection_shape = this._selection_shape as SVGCircle
        selection_shape.setProp('x', width / 2 + 0.5 * strokeWidth)
        selection_shape.setProp('r', width / 2)
      } else {
        const selection_shape = this._selection_shape as SVGRect
        selection_shape.setProp('width', current)
      }
    } else if (prop === 'height') {
      const { shape, height, strokeWidth = 1 } = this.$props

      mergePropStyle(this._selection, {
        height: `${height + strokeWidth}px`,
      })

      if (shape === 'circle') {
        const selection_shape = this._selection_shape as SVGCircle
        selection_shape.setProp('y', height / 2 + 0.5 * strokeWidth)
      } else {
        const selection_shape = this._selection_shape as SVGRect
        selection_shape.setProp('height', current)
      }
    } else if (prop === 'strokeDasharray') {
      mergePropStyle(this._selection_shape, {
        strokeDasharray: current,
      })
    } else if (prop === 'strokeDashOffset') {
      mergePropStyle(this._selection_shape, {
        strokeDashoffset: `${current ?? 0}`,
      })
    } else if (prop === 'shape') {
      const selection_shape = this._render_selection_shape()
      this._selection_shape = selection_shape
      this._selection.setChildren([selection_shape])
    } else if (prop === 'x') {
      const { x = 0 } = this.$props
      mergePropStyle(this._selection, {
        left: `calc(50% + ${x}px)`,
      })
    } else if (prop === 'y') {
      const { y = 0 } = this.$props
      mergePropStyle(this._selection, {
        top: `calc(50% + ${y}px)`,
      })
    }
  }
}
