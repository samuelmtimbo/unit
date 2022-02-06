import classnames from '../../../../../client/classnames'
import { getSpecRadius } from '../../../../../client/complexity'
import { Component } from '../../../../../client/component'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { isComponent } from '../../../../../client/spec'
import {
  pointInCircle,
  pointInRectangle,
  unitVector,
} from '../../../../../client/util/geometry'
import { getUnitPinPosition } from '../../../../../client/util/geometry/unit/getUnitPinPosition'
import { LINK_DISTANCE } from '../../../../../constant/LINK_DISTANCE'
import { PIN_RADIUS } from '../../../../../constant/PIN_RADIUS'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IO } from '../../../../../types/IO'
import Icon from '../../../component/Icon/Component'
import SVGCircle from '../../../component/svg/Circle/Component'
import SVGG from '../../../component/svg/G/Component'
import SVGLine from '../../../component/svg/Line/Component'
import SVGRect from '../../../component/svg/Rect/Component'
import SVGSVG from '../../../component/svg/SVG/Component'
import SVGText from '../../../component/svg/SVGText/Component'

const OPENING: number = 120

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
}

export const CLASS_DEFAULT_WIDTH = 90
export const CLASS_DEFAULT_HEIGHT = 90

export function line_wrap(text: string, MAX: number = 15): string[] {
  const lines: string[] = []

  const segments = text.split(' ')

  const l = segments.length

  let line_segments: string[] = []
  let line_segments_char_count = 0

  for (let i = 0; i < l; i++) {
    const segment = segments[i]
    const segment_l = segment.length

    if (line_segments_char_count + line_segments.length - 1 + segment_l > MAX) {
      lines.push(line_segments.join(' '))
      line_segments = []
      line_segments_char_count = 0
    }

    line_segments.push(segment)
    line_segments_char_count += segment_l
  }

  if (line_segments.length > 0) {
    lines.push(line_segments.join(' '))
  }

  return lines
}

export default class ClassDatum extends Element<HTMLDivElement, Props> {
  private _svg: SVGSVG
  private _svg_g: SVGG

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { id, className, style } = $props

    let width: number = CLASS_DEFAULT_WIDTH
    let height: number = CLASS_DEFAULT_HEIGHT

    const svg = new SVGSVG(
      {
        className: classnames('unit-class', className),
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          color: 'currentColor',
          pointerEvents: 'none',
          ...style,
        },
        viewBox: `0 0 ${width} ${height}`,
      },
      this.$system,
      this.$pod
    )
    this._svg = svg

    const svg_g = new SVGG(
      {
        className: classnames('unit-class-g', className),
        style: {
          pointerEvents: 'all',
        },
      },
      this.$system,
      this.$pod
    )
    this._svg_g = svg_g
    this._svg.registerParentRoot(svg_g)

    if (id) {
      this._render(id)
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$slot['default'] = svg

    this.registerRoot(svg)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'id') {
      this._render(current)
      // AD HOC
      this.dispatchEvent('datumchange', { data: current })
    }
  }

  private _render = (id: string): void => {
    const { specs } = this.$system

    const spec = specs[id]

    const { name = '' } = spec

    let width: number = CLASS_DEFAULT_WIDTH
    let height: number = CLASS_DEFAULT_HEIGHT

    const children: Component[] = []

    const { inputs = {}, outputs = {} } = spec

    const core_r = getSpecRadius(specs, id) - 2
    const r = PIN_RADIUS - 3

    const is_component = isComponent(specs, id)

    const cX = width / 2
    const cY = height / 2

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

    const push_pin = (type: IO, i: number): void => {
      const count = pin_count[type]
      const { x, y } = getUnitPinPosition(
        i,
        count,
        type,
        r,
        cX,
        cY,
        core_r,
        OPENING,
        LINK_DISTANCE / 9
      )
      const u = unitVector(x, y, cX, cY)
      const nu = { x: -u.x, y: -u.y }
      const pin = new SVGCircle(
        {
          className: classnames('unit-class-pin', `unit-class-${type}`),
          x,
          y,
          r,
          style: {
            strokeWidth: '1px',
            stroke: 'currentColor',
            fill: type === 'output' ? 'currentColor' : 'none',
          },
        },
        this.$system,
        this.$pod
      )
      children.push(pin)
      const { x: x1, y: y1 } = pointInCircle(x, y, r, u)
      const { x: x2, y: y2 } = !is_component
        ? pointInCircle(cX, cY, core_r, nu)
        : pointInRectangle(cX, cY, 2 * core_r, 2 * core_r, nu)
      const pin_link = new SVGLine(
        {
          className: classnames(
            'unit-interface-link',
            `unit-interface-link-${type}`
          ),
          x1,
          y1,
          x2,
          y2,
          style: {
            strokeWidth: '1px',
            stroke: 'currentColor',
          },
        },
        this.$system,
        this.$pod
      )
      children.push(pin_link)
    }

    input_pin_ids.forEach((_, index: number) => {
      push_pin('input', index)
    })

    const icon = (spec.metadata && spec.metadata.icon) || 'question'

    let core_shape: SVGCircle | SVGRect
    if (is_component) {
      core_shape = new SVGRect(
        {
          className: 'unit-class-core-shape',
          x: cX - core_r,
          y: cY - core_r,
          width: 2 * core_r,
          height: 2 * core_r,
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
      core_shape = new SVGCircle(
        {
          className: 'unit-class-core-shape',
          x: cX,
          y: cY,
          r: core_r,
          style: {
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1px',
          },
        },
        this.$system,
        this.$pod
      )
    }

    const core_icon: Icon = new Icon(
      {
        className: 'unit-class-core-icon',
        icon,
        x: cX - core_r / 2,
        y: cY - core_r / 2,
        width: core_r,
        height: core_r,
        style: {
          color: 'currentColor',
        },
      },
      this.$system,
      this.$pod
    )

    const core = new SVGG(
      {
        className: 'unit-class-core',
      },
      this.$system,
      this.$pod
    )
    core.appendChild(core_shape)
    core.appendChild(core_icon)
    children.push(core)

    output_pin_ids.forEach((_, index: number) => {
      push_pin('output', index)
    })

    const core_name_g = new SVGG({}, this.$system, this.$pod)
    const lines = line_wrap(name)
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i]
      const core_name_line = new SVGText(
        {
          text,
          dx: width / 2,
          dy: height / 2 + core_r + 12 + i * 9,
          style: {
            fontSize: '9px',
          },
          textAnchor: 'middle',
        },
        this.$system,
        this.$pod
      )
      core_name_g.appendChild(core_name_line)
    }
    children.push(core_name_g)

    this._svg_g.setChildren(children)
  }
}
