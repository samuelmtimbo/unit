import classnames from '../../../../../client/classnames'
import { Element } from '../../../../../client/element'
import { getSpec, isComponent } from '../../../../../client/spec'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IO } from '../../../../../types/IO'
import SVGCircle from '../../../component/svg/Circle/Component'
import SVGRect from '../../../component/svg/Rect/Component'
import SVGSVG from '../../../component/svg/SVG/Component'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
}

export default class Minimal extends Element<SVGElement, Props> {
  private _svg: SVGSVG

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { id, className, style } = $props

    let width: number = 80
    let height: number = 16

    const svg = new SVGSVG(
      {
        className: classnames('unit-minimal', className),
        style: { ...this._default_style(), ...style },
      },
      this.$system,
      this.$pod
    )
    this._svg = svg

    if (id) {
      this._render(id)
    }

    this.$element = svg.$element
    this.$slot['default'] = svg.$slot['default']

    this.registerRoot(svg)
  }

  private _default_style = () => {
    let width: number = 80
    let height: number = 16

    return {
      width: `${width}px`,
      height: `${height}px`,
      color: 'currentColor',
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'id') {
      this._render(current)
    } else if (prop === 'style') {
      this._svg.setProp('style', { ...this._default_style(), ...current })
    }
  }

  private _render = (id: string): void => {
    const { specs } = this.$system

    const spec = getSpec(specs, id)

    let width: number = 80
    let height: number = 16

    const R = 4

    const children: Element[] = []

    const { inputs = {}, outputs = {} } = spec

    const is_component = isComponent(specs, id)

    const cX = width / 2
    const cY = height / 2 - 0.5

    let input_pin_ids = Object.keys(inputs).filter((pinId) => {
      const input = inputs[pinId]
      const { defaultIgnored } = input
      if (defaultIgnored) {
        return false
      }
      return true
    })

    const output_pin_ids = Object.keys(outputs).filter((pinId) => {
      const output = outputs[pinId]
      const { defaultIgnored } = output
      if (defaultIgnored) {
        return false
      }
      return true
    })

    const pin_count = {
      input: input_pin_ids.length,
      output: output_pin_ids.length,
    }

    const r = 1

    const push_pin = (type: IO, i: number): void => {
      const count = pin_count[type]

      let x: number = cX
      let y: number = cY

      const pair = i % 2 === 0
      if (type === 'input') {
        const position = Math.floor((count - i - 1) / 2)
        x -= position * (r + 3) + (R + 3)
        if (i > 0) {
          if (pair) {
            y -= r + 1
          } else {
            y += r + 1
          }
        }
      } else {
        const position = Math.ceil((i + 1) / (2 + 0.001)) - 1
        x += position * (r + 3) + (R + 3)
        if (position < (count - 1) / 2) {
          if (pair) {
            y -= r + 1
          } else {
            y += r + 1
          }
        }
      }

      const pin = new SVGCircle(
        {
          className: classnames('unit-minimal-pin', `unit-minimal-${type}`),
          x,
          y,
          r,
          style: {
            strokeWidth: 'px',
            stroke: 'currentColor',
            // fill: type === 'output' ? 'currentColor' : 'none',
            fill: 'currentColor',
          },
        },
        this.$system,
        this.$pod
      )
      children.push(pin)
    }

    input_pin_ids.forEach((_, index: number) => {
      push_pin('input', index)
    })

    let core: SVGCircle | SVGRect
    if (is_component) {
      core = new SVGRect(
        {
          className: 'unit-minimal-core',
          x: cX - R,
          y: cY - R,
          width: 2 * R,
          height: 2 * R,
          style: {
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1px',
          },
        },
        this.$system,
        this.$pod
      )
    } else {
      core = new SVGCircle(
        {
          className: 'unit-minimal-core',
          x: cX,
          y: cY,
          r: R,
          style: {
            // fill: 'none',
            fill: 'currentColor',
            stroke: 'currentColor',
            strokeWidth: '1px',
          },
        },
        this.$system,
        this.$pod
      )
    }

    children.push(core)

    output_pin_ids.forEach((_, index: number) => {
      push_pin('output', index)
    })

    this._svg.setChildren(children)
  }
}
