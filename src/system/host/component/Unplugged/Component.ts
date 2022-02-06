import { ANIMATION_T_S } from '../../../../client/animation/ANIMATION_T_S'
import { Component } from '../../../../client/component'
import mergeStyle from '../../../../client/component/mergeStyle'
import parentElement from '../../../../client/platform/web/parentElement'
import { polarToCartesian } from '../../../../client/util/geometry'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { rangeArray } from '../../../../util/array'
import SVGCircle from '../../../platform/component/svg/Circle/Component'
import SVGPath from '../../../platform/component/svg/Path/Component'
import SVGSVG from '../../../platform/component/svg/SVG/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  id?: [number, number, number, number, number, number]
}

type LogoPath = {
  x: number
  y: number
  r: number
  d1: number
  d2: number
  strokeWidth: number
  strokeDashArray?: string
}

export const DEFAULT_STYLE = {}

function hashCode(str: string): number {
  let hash = 0
  if (str.length === 0) {
    return hash
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // convert to 32 bit integer
  }
  return hash
}

const randomNumberBetween = (min: number, max: number): number => {
  return min + Math.random() * (max - min)
}

const numberBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min))

const randomStrokeDashArray = (): string => {
  const size = randomNumberBetween(MIN_DASH_ARRAY_SIZE, MAX_DASH_ARRAY_SIZE)
  const dashArray: number[] = []
  for (let i = 0; i < size; i++) {
    dashArray.push(
      randomNumberBetween(MIN_DASH_ARRAY_VALUE, MAX_DASH_ARRAY_VALUE)
    )
  }
  return dashArray.join(' ')
}

const randomElement = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)]
}

const MAX_RADIUS = 80
const MIN_STROKE_WIDTH = 9
const MAX_STROKE_WIDTH = 9

const MIN_ANGLE = 60
const MAX_ANGLE = 360

const CENTER_X = 100
const CENTER_Y = 100

const BASE_CENTER_RADIUS = 15
const BASE_LINE_LENGTH = 100

const MIN_DASH_ARRAY_SIZE = 0
const MAX_DASH_ARRAY_SIZE = 2

const MIN_DASH_ARRAY_VALUE = 0
const MAX_DASH_ARRAY_VALUE = 9

const N = 3

export function generate(): LogoPath[] {
  const paths: LogoPath[] = []
  // const nOfCircles = numberBetween(MIN_N_CIRC, MAX_N_CIRC)
  for (let i = 0; i < N; i++) {
    // const d1 = numberBetween(MIN_ANGLE, MAX_ANGLE)
    // const d2 = d1 + numberBetween(MIN_ANGLE, (2 * MAX_ANGLE) / 3)
    let t: number
    let d1: number = numberBetween(0, 360)
    let d2: number = numberBetween(0, 360)

    if (d1 > d2) {
      t = d1
      d1 = d2
      d2 = t
    }

    paths.push({
      // r: BASE_CENTER_RADIUS + (MAX_RADIUS / N) * numberBetween(i, i + 1),
      r: BASE_CENTER_RADIUS + (MAX_RADIUS / (N + 1)) * i - 6,
      strokeWidth: numberBetween(MIN_STROKE_WIDTH, MAX_STROKE_WIDTH),
      d1,
      d2,
      x: CENTER_X,
      y: CENTER_Y,
      // strokeDashArray: trueOrFalse(0.1) ? randomStrokeDashArray() : '',
    })
  }
  return paths
}

export default class Unplugged extends Component<HTMLDivElement, Props> {
  private _container: SVGSVG
  private _paths: SVGPath[] = []

  private _base: SVGCircle

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {} } = this.$props

    const children: Component[] = []
    rangeArray(N).forEach(() => {
      const path = new SVGPath(
        {
          style: {
            fill: 'none',
            stroke: 'currentColor',
            transition: `stroke ${ANIMATION_T_S}s linear`,
            strokeWidth: '9px',
          },
          d: '',
        },
        this.$system,
        this.$pod
      )
      this._paths.push(path)
      children.push(path)
    })

    const base = new SVGCircle(
      {
        r: BASE_CENTER_RADIUS,
        x: CENTER_X,
        y: CENTER_Y,
        style: {
          fill: 'currentColor',
          transition: `fill ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    this._base = base
    children.push(base)

    const container = new SVGSVG(
      {
        viewBox: '0 0 200 200',
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    container.setChildren(children)
    this._container = container

    this._reset()

    const $element = parentElement($system)

    this.$element = $element
    this.$slot['default'] = container.$slot['default']

    this.registerRoot(container)
  }

  private _d1i: number[] = []
  private _d2i: number[] = []

  private _d1: number[] = []
  private _d2: number[] = []

  private _start_angle: number[] = []
  private _end_angle: number[] = []

  private _animating: boolean[] = [false, false, false]

  private _reset = () => {
    const { id = [0, 0, 0, 0, 0, 0] } = this.$props

    for (let i = 0; i < 6; i += 2) {
      const j = i + 1

      const r = BASE_CENTER_RADIUS + (MAX_RADIUS / (N + 1)) * (i / 2 + 1)

      let d1 = (id[i] * 360) / 10
      let d2 = (d1 + (id[j] * 360) / 10) % 360

      let td: number

      if (d1 > d2) {
        td = d1
        d1 = d2
        d2 = td
      }

      const k = i / 2

      this._d1[k] = d1
      this._d2[k] = d2

      let t = 0

      if (this._animating[k]) {
        cancelAnimationFrame(this._frame)

        this._frame = undefined

        this._d1i[k] = this._start_angle[k]
        this._d2i[k] = this._end_angle[k]
      }

      const _d1i = this._d1i[k] || 0
      const _d2i = this._d2i[k] || 0

      this._start_angle[k] = _d1i
      this._end_angle[k] = _d2i

      this._animating[k] = true

      const x = CENTER_X
      const y = CENTER_Y

      const path = this._paths[k]

      mergeStyle(path, {
        fill: 'none',
      })

      const T = 24

      const frame = () => {
        const _d1i = this._d1i[k] || 0
        const _d2i = this._d2i[k] || 0

        const d1 = this._d1[k]
        const d2 = this._d2[k]

        if (t <= T) {
          this._start_angle[k] = _d1i + ((d1 - _d1i) * t) / T
          this._end_angle[k] = _d2i + ((d2 - _d2i) * t) / T

          const start = polarToCartesian(x, y, r, this._end_angle[k])
          const end = polarToCartesian(x, y, r, this._start_angle[k])

          const largeArcFlag =
            this._end_angle[k] - this._start_angle[k] <= 180 ? '0' : '1'

          const d = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`

          path.setProp('d', d)

          this._frame = requestAnimationFrame(frame)

          t++
        } else {
          this._animating[k] = false

          this._d1i[k] = d1
          this._d2i[k] = d2

          this._d1[k] = d1
          this._d2[k] = d2

          this._start_angle[k] = d1
          this._end_angle[k] = d2
        }
      }

      frame()
    }
  }

  private _frame: number

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._container.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'id') {
      this._reset()
    }
  }
}
