import classnames from '../../../../../client/classnames'
import { getSpecRadius } from '../../../../../client/complexity'
import { Component } from '../../../../../client/component'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { isComponentId } from '../../../../../client/spec'
import {
  pointInCircle,
  pointInRectangle,
  unitVector,
} from '../../../../../client/util/geometry'
import { Size } from '../../../../../client/util/geometry/types'
import { getUnitPinPosition } from '../../../../../client/util/geometry/unit/getUnitPinPosition'
import { LINK_DISTANCE } from '../../../../../constant/LINK_DISTANCE'
import { PIN_RADIUS } from '../../../../../constant/PIN_RADIUS'
import { lineWrap } from '../../../../../spec/lineWrap'
import { System } from '../../../../../system'
import { Specs } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { IO } from '../../../../../types/IO'
import { keys } from '../../../../f/object/Keys/f'
import Icon from '../../../component/Icon/Component'
import SVGCircle from '../../svg/Circle/Component'
import SVGG from '../../svg/Group/Component'
import SVGLine from '../../svg/Line/Component'
import SVGRect from '../../svg/Rect/Component'
import SVGSVG from '../../svg/SVG/Component'
import SVGText from '../../svg/Text/Component'

const OPENING: number = 120

export interface Props {
  id?: string
  className?: string
  attr?: Dict<string>
  style?: Dict<string>
  specs: Specs
}

export const CLASS_DEFAULT_WIDTH = 90
export const CLASS_DEFAULT_HEIGHT = 90

export default class ClassDatum extends Element<HTMLDivElement, Props> {
  private _svg: SVGSVG
  private _svg_g: SVGG

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { id, attr, className } = $props

    const { width, height } = this._size()

    const svg = new SVGSVG(
      {
        className: classnames('unit-class', className),
        width,
        height,
        style: this._style(),
        attr,
        viewBox: `-1 -1 ${width + 2} ${height + 2}`,
      },
      this.$system
    )
    this._svg = svg

    const svg_g = new SVGG(
      {
        className: classnames('unit-class-g', className),
        style: {},
      },
      this.$system
    )
    this._svg_g = svg_g
    this._svg.registerParentRoot(svg_g)

    if (id) {
      this._render(id)
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$slot['default'] = svg

    this.setSubComponents({
      svg,
      svg_g,
    })

    this.registerRoot(svg)
  }

  private _refresh_style = () => {
    const style = this._style()

    this._svg.setProp('style', style)
  }

  private _refresh_view_box = () => {
    const { width, height } = this._size()

    this._svg.setProp('viewBox', `-1 -1 ${width + 2} ${height + 2}`)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'id') {
      this._render(current)
      this._refresh_style()
      this._refresh_view_box()
    } else if (prop === 'style') {
      this._svg.setProp('style', this._style())
    } else if (prop === 'attr') {
      this._svg.setProp('attr', current)
    }
  }

  private _r = (): number => {
    const { specs, id } = this.$props

    const r = getSpecRadius(specs, id) - 1.5

    return r
  }

  private _size = (): Size => {
    const r = this._r()

    const width: number = 2 * r
    const height: number = 2 * r

    return { width, height }
  }

  private _style = () => {
    const { style } = this.$props

    const { width, height } = this._size()

    return {
      width: `${width}px`,
      height: `${height}px`,
      color: 'currentColor',
      pointerEvents: 'none',
      overflow: 'visible',
      ...style,
    }
  }

  private _render = (id: string): void => {
    const { specs = this.$system.specs } = this.$props

    const spec = specs[id]

    const { name = '' } = spec

    const children: Component[] = []

    const { inputs = {}, outputs = {} } = spec

    const { width, height } = this._size()
    const core_r = this._r()

    const r = PIN_RADIUS - 3

    const is_component = isComponentId(specs, id)

    const cX = width / 2
    const cY = height / 2

    let input_pin_ids = keys(inputs).filter((pinId) => {
      const input = inputs[pinId]
      const { defaultIgnored } = input
      if (defaultIgnored) {
        return false
      }
      return true
    })

    const output_pin_ids = keys(outputs).filter((pinId) => {
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
        this.$system
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
        this.$system
      )
      children.push(pin_link)

      this._svg.setProp('viewBox', `-1 -1 ${width + 2} ${height + 2}`)
    }

    input_pin_ids.forEach((_, index: number) => {
      push_pin('input', index)
    })

    // const icon = (spec.metadata && spec.metadata.icon) || 'question'
    const icon = (spec.metadata && spec.metadata.icon) || null

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
        this.$system
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
        this.$system
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
      this.$system
    )

    const core = new SVGG(
      {
        className: 'unit-class-core',
      },
      this.$system
    )
    core.appendChild(core_shape)
    core.appendChild(core_icon)
    children.push(core)

    output_pin_ids.forEach((_, index: number) => {
      push_pin('output', index)
    })

    const core_name_g = new SVGG({}, this.$system)
    const lines = lineWrap(name)
    for (let i = 0; i < lines.length; i++) {
      const value = lines[i]
      const core_name_line = new SVGText(
        {
          value,
          dx: `${width / 2}`,
          dy: `${height / 2 + core_r + 12 + i * 9}`,
          style: {
            fontSize: '9px',
          },
          textAnchor: 'middle',
        },
        this.$system
      )
      core_name_g.appendChild(core_name_line)
    }
    children.push(core_name_g)

    this._svg_g.setChildren(children)
  }
}
