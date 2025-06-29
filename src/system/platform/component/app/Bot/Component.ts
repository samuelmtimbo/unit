import { PositionObserver_ } from '../../../../../client/PositionObserver'
import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_C } from '../../../../../client/animation/ANIMATION_C'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Context } from '../../../../../client/context'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { UnitPointerEvent } from '../../../../../client/event/pointer'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { makeResizeListener } from '../../../../../client/event/resize'
import { harmonicArray } from '../../../../../client/id'
import { randomBetween } from '../../../../../client/math'
import { Mode } from '../../../../../client/mode'
import { parseLayoutValue } from '../../../../../client/parseLayoutValue'
import { applyStyle } from '../../../../../client/style'
import { getThemeModeColor } from '../../../../../client/theme'
import {
  describeEllipseArc,
  norm,
  pointDistance,
  unitVector,
} from '../../../../../client/util/geometry'
import { Point, Position } from '../../../../../client/util/geometry/types'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { clamp } from '../../../../core/relation/Clamp/f'

const HARMONIC = harmonicArray(20)

export const DEFAULT_N = 4
export const DEFAULT_K = 4
export const DEFAULT_R = 42

export const DEFAULT_MODE = 'none'

const MOVE_TIMEOUT_MAX = 12 // sec

export interface Props {
  style?: Dict<string>
  className?: string
  disabled?: boolean
  r?: number
  mode?: Mode
  x?: number
  y?: number
  context?: Context
}

export const DEFAULT_STYLE = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  color: 'current-color',
  'pointer-events': 'none',
}

export default class Bot extends Element<HTMLDivElement, Props> {
  private _r: number = 0

  private _x: number = 0
  private _y: number = 0

  private _tx: number = 0 // target x
  private _ty: number = 0 // target y

  private _svg: SVGSVGElement

  private _pointer_position: Dict<Position> = {}
  private _pointer_down_position: Dict<Position> = {}
  private _pointer_down: Dict<boolean> = {}
  private _pointer_occluded: Dict<boolean> = {}
  private _pointer_down_count: number = 0
  private _pointer_enter_count: number = 0
  private _pointer_inside: Dict<boolean> = {}
  private _pointer_visible: boolean = false
  private _pointer_tracked: boolean = false

  private _bot: SVGGElement
  private _eye_ellipse: SVGEllipseElement[] = []
  private _eye_ball: SVGEllipseElement
  private _eye_brow: SVGPathElement

  private _laser: Dict<SVGGElement> = {}
  private _laser_ray: Dict<SVGLineElement> = {}
  private _laser_focus: Dict<SVGEllipseElement> = {}

  private _removed: boolean = false

  private _move_timeout: number

  private _container: HTMLDivElement

  private _container_x: number = 0
  private _container_y: number = 0
  private _container_rx: number = 0
  private _container_ry: number = 0
  private _container_rz: number = 0
  private _container_sx: number = 1
  private _container_sy: number = 1

  private _move_animation_frame: number | undefined = undefined
  private _sync_animation_frame: number | undefined = undefined

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      r = DEFAULT_R,
      disabled,
      x = 0,
      y = 0,
    } = this.$props

    const n = DEFAULT_N

    this._x = x - r - 2
    this._y = y - r - 2

    const container = this.$system.api.document.createElement('div')
    applyStyle(container, { ...DEFAULT_STYLE, ...style })
    this._container = container

    const svg = this.$system.api.document.createElementNS(namespaceURI, 'svg')
    svg.classList.add('bot-svg')
    if (className) {
      svg.classList.add(className)
    }
    applyStyle(svg, {
      ...{
        position: 'absolute',
        top: '0',
        left: '0',
        stroke: 'currentColor',
        cursor: 'default',
      },
    })
    this._svg = svg

    this._bot = this.$system.api.document.createElementNS(namespaceURI, 'g')
    this._bot.classList.add('eye')

    for (let i = 0; i < n; i++) {
      const ellipse = this.$system.api.document.createElementNS(
        namespaceURI,
        'ellipse'
      )
      ellipse.classList.add('eye-ellipse')
      ellipse.style.fill = `none`
      ellipse.style.strokeWidth = `1px`
      this._eye_ellipse.push(ellipse)
      this._bot.appendChild(ellipse)
    }

    this._eye_ball = this.$system.api.document.createElementNS(
      namespaceURI,
      'ellipse'
    )
    this._eye_ball.classList.add('eye-ball')
    this._bot.appendChild(this._eye_ball)

    this._eye_brow = this.$system.api.document.createElementNS(
      namespaceURI,
      'path'
    )
    this._eye_brow.classList.add('eye-brow')
    this._eye_brow.setAttribute('fill', 'none')
    this._eye_brow.setAttribute('stroke-width', '3')
    this._bot.appendChild(this._eye_brow)

    svg.appendChild(this._bot)

    container.appendChild(svg)

    this.$element = container

    this.addEventListener(makePointerEnterListener(this._onPointerEnter))
    this.addEventListener(makePointerLeaveListener(this._onPointerLeave))

    const position_observer = new PositionObserver_(this.$system, (x, y) => {
      if (this.$context) {
        this._container_x = x - this.$context.$x
        this._container_y = y - this.$context.$y
      }
    })

    this._position_observer = position_observer

    // this._tick_body()
  }

  private _position_observer: PositionObserver_

  private _enabled = (): boolean => {
    const { disabled } = this.$props
    if (document.visibilityState === 'visible') {
      return !disabled
    } else {
      return false
    }

    return !disabled
  }

  private _disabled: boolean = true

  private _refresh_enabled = (): void => {
    if (this._enabled()) {
      this._enable()
    } else {
      this._disable()
    }
  }

  private _reset_move_timeout = (offset: number = 0) => {
    // console.log('Bot', '_reset_move_timeout')

    const {
      api: {
        window: { clearTimeout },
      },
    } = this.$system

    if (this._move_timeout) {
      clearTimeout(this._move_timeout)
    }
    const moveTimeoutHandler = () => {
      this._start_move()

      this._reset_move_timeout()
    }

    // @ts-ignore
    this._move_timeout = setTimeout(
      moveTimeoutHandler,
      offset + randomBetween(0, MOVE_TIMEOUT_MAX) * 1000
    )
  }

  private _enable = () => {
    if (this._disabled) {
      // console.log('Bot', '_enable')
      this._disabled = false
      this._follow()
      this._reset_move_timeout(1000)
    }
  }

  private _disable = () => {
    const {
      api: {
        window: { clearTimeout },
      },
    } = this.$system

    if (!this._disabled) {
      // console.log('Bot', '_disable')

      this._disabled = true

      if (this._move_timeout) {
        clearTimeout(this._move_timeout)
      }

      this._unfollow()
    }
  }

  private _pointing_self: Dict<boolean> = {}
  private _pointing_self_count: number = 0

  private _synced: boolean = true

  private _get_pointer_xyz = (): [number, number, number] => {
    const { $width, $height } = this.$context

    let x: number = 1
    let y: number = 1
    let z: number = 0

    const center = this._center() as Point

    let pointer_center = center
    let pointer_sum_x = 0
    let pointer_sum_y = 0
    let pointer_count = 0

    for (let pointerId in this._pointer_position) {
      pointer_count++

      const p = this._pointer_position[pointerId]

      const { x, y } = p

      pointer_sum_x += x
      pointer_sum_y += y
    }

    if (pointer_count > 0 && !this._disabled) {
      pointer_center = {
        x: pointer_sum_x / pointer_count,
        y: pointer_sum_y / pointer_count,
      }
      const center = this._center()
      const d = pointDistance(center, pointer_center)
      const D = norm($width, $height)
      const u = unitVector(
        center.x,
        center.y,
        pointer_center.x,
        pointer_center.y
      )
      x = u.x
      y = u.y
      z = Math.min(d, D) / D
    }

    return [x, y, z]
  }

  private _get_target_xyz = (): [number, number, number] => {
    if (this._synced) {
      return this._get_pointer_xyz()
    } else {
      return [this._temp_x, this._temp_y, this._temp_z]
    }
  }

  private _temp_x: number = 0
  private _temp_y: number = 0
  private _temp_z: number = 0

  private _tick_body() {
    const { r = DEFAULT_R } = this.$props

    const n = DEFAULT_N
    const k = DEFAULT_K

    const cX = r + 3 // BORDER
    const cY = r + 3

    let angle: number = 0

    const center = this._center() as Point

    for (let pointerId in this._pointer_position) {
      const p = this._pointer_position[pointerId]

      const d = pointDistance({ x: center.x + 3, y: center.y + 3 }, p)

      if (d > r + 1) {
        if (this._pointing_self[pointerId]) {
          this.__onPointerLeave(Number.parseInt(pointerId))
        }
      } else {
        if (!this._pointing_self[pointerId]) {
          this.__onPointerEnter(Number.parseInt(pointerId))
        }
      }
    }

    const [x, y, z] = this._get_target_xyz()

    this._temp_x = x
    this._temp_y = y
    this._temp_z = z

    angle = (Math.atan2(y, x) * 180) / Math.PI + 90

    if (angle < 0) {
      angle += 360
    }

    const kx = x * z * (r - 9)
    const ky = y * z * (r - 9)

    this._bot.style.transform = `translate(${this._x}px, ${this._y}px)`

    for (let i = 0; i < n; i++) {
      const h = HARMONIC[i]
      const rx = r / (i + 1)
      const ry = rx * (1 - z / k)
      const kcx = (h * kx) / k
      const kcy = (h * ky) / k
      const cx = cX + (k * kcx) / 2
      const cy = cY + (k * kcy) / 2

      let ellipse = this._eye_ellipse[i]

      ellipse.setAttribute('rx', rx.toString())
      ellipse.setAttribute('ry', ry.toString())
      ellipse.setAttribute('cx', cx.toString())
      ellipse.setAttribute('cy', cy.toString())

      ellipse.style.transformOrigin = `${cx}px ${cy}px`
      ellipse.style.transform = `rotate(${angle}deg)`
    }

    const hn = HARMONIC[n - 1]

    const w = this._pointing_self_count > 0 ? 7 : 8

    const rx = r / (n + 1) / w
    const ry = Math.max(rx * (1 - z / k), 1)

    const kcx = (hn * kx) / k
    const kcy = (hn * ky) / k

    const cx = cX + (k * kcx) / 2
    const cy = cY + (k * kcy) / 2

    this._eye_ball.setAttribute('rx', rx.toString())
    this._eye_ball.setAttribute('ry', ry.toString())
    this._eye_ball.setAttribute('cx', cx.toString())
    this._eye_ball.setAttribute('cy', cy.toString())

    this._eye_ball.style.transformOrigin = `${cx}px ${cy}px`
    this._eye_ball.style.transform = `rotate(${angle}deg)`

    this._bot.appendChild(this._eye_ball)

    const startAngle = 300
    const stopAngle = 330

    this._eye_brow.style.transformOrigin = `${cX}px ${cY}px`
    this._eye_brow.style.transform = `rotate(${angle}deg)`

    this._eye_brow.setAttribute(
      'd',
      describeEllipseArc(
        cX,
        cY,
        r + 6,
        (r + 6) * (1 - z / 2.5),
        startAngle - (stopAngle - startAngle) / 5,
        startAngle + (stopAngle - startAngle) / 5
      )
    )

    for (let pointerId in this._laser_position) {
      const p = this._laser_position[pointerId]

      let laser = this._laser[pointerId]
      let laser_ray = this._laser_ray[pointerId]
      let laser_focus = this._laser_focus[pointerId]

      if (!laser) {
        const { mode_color } = this._get_color()

        laser = this.$system.api.document.createElementNS(namespaceURI, 'g')

        laser.classList.add('laser')

        laser_ray = this.$system.api.document.createElementNS(
          namespaceURI,
          'line'
        )

        laser_ray.classList.add('laser-ray')

        laser_ray.style.stroke = mode_color
        laser_ray.style.strokeDasharray = '2'
        laser_ray.style.strokeWidth = '2'

        laser.appendChild(laser_ray)

        laser_focus = this.$system.api.document.createElementNS(
          namespaceURI,
          'ellipse'
        )

        laser_focus.classList.add('laser-focus')

        laser_focus.style.fill = mode_color
        laser_focus.style.stroke = mode_color
        laser_focus.style.transformOrigin = '50% 50%'

        laser_focus.setAttribute('rx', '1')
        laser_focus.setAttribute('ry', '1')

        laser.appendChild(laser_focus)

        this._laser[pointerId] = laser
        this._laser_focus[pointerId] = laser_focus
        this._laser_ray[pointerId] = laser_ray

        this._svg.appendChild(laser)
      }

      const lx = p.x
      const ly = p.y
      const lxs = lx.toString()
      const lys = ly.toString()

      laser_ray.setAttribute('x1', (this._x + cx).toString())
      laser_ray.setAttribute('y1', (this._y + cy).toString())
      laser_ray.setAttribute('x2', lxs)
      laser_ray.setAttribute('y2', lys)

      laser_focus.setAttribute('cx', lxs)
      laser_focus.setAttribute('cy', lys)
    }
  }

  private _center = (): Position => {
    const { r = DEFAULT_R } = this.$props
    const center = { x: this._x + r, y: this._y + r }
    return center
  }

  public getPosition = (): Position => {
    return {
      x: this._x,
      y: this._y,
    }
  }

  public setPosition = ({ x, y }: Position): void => {
    this._x = x
    this._y = y
  }

  public setOccluded = (pointerId: number, occluded: boolean): void => {
    // console.log('Bot', 'setOccluded', pointerId, occluded)
    if (occluded) {
      this._pointer_occluded[pointerId] = true
    } else {
      delete this._pointer_occluded[pointerId]
    }
  }

  private _start_move = (): void => {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.$system

    if (this._pointing_self_count > 0) {
      return
    }

    const { r = DEFAULT_R } = this.$props
    const { $width, $height } = this.$context

    const D = 2 * r + 3

    this._tx = randomBetween(3, $width - D)
    this._ty = randomBetween(3, $height - D)

    this._move_animation_frame = requestAnimationFrame(this._move_tick)
  }

  public _move_tick = (): void => {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.$system

    if (Math.abs(this._x - this._tx) > 1 || Math.abs(this._y - this._ty) > 1) {
      this._x += (this._tx - this._x) / (3 * ANIMATION_C)
      this._y += (this._ty - this._y) / (3 * ANIMATION_C)

      this._tick_body()

      this._move_animation_frame = requestAnimationFrame(this._move_tick)
    } else {
      this._move_animation_frame = undefined
    }
  }

  private _start_sync = (): void => {
    const {
      api: {
        animation: { requestAnimationFrame },
      },
    } = this.$system

    // console.log('Bot', '_start_sync')
    this._sync_animation_frame = requestAnimationFrame(this._sync_tick)
  }

  private _sync_tick = (): void => {
    if (this._synced) {
      return
    }

    const [tx, ty, tz] = this._get_pointer_xyz()

    const dx = tx - this._temp_x
    const dy = ty - this._temp_y
    const dz = tz - this._temp_z

    const k = 1 / 4

    if (Math.abs(dx) > k || Math.abs(dy) > k || Math.abs(dz) > k) {
      this._temp_x += dx / (3 * ANIMATION_C)
      this._temp_y += dy / (3 * ANIMATION_C)
      this._temp_z += dz / (3 * ANIMATION_C)

      this._start_sync()
    } else {
      this._synced = true

      for (const pointer_id in this._pointer_down) {
        this._laser_position[pointer_id] = this._pointer_position[pointer_id]
      }
    }

    this._tick_body()
  }

  private _onPointerEnter = (event: UnitPointerEvent) => {
    // console.log('Bot', '_onPointerEnter')
    const { pointerId, pointerType } = event

    this.__onPointerEnter(pointerId)
  }

  private __onPointerEnter = (pointerId: number) => {
    // console.log('Bot', '__onPointerEnter')
    this._pointing_self[pointerId] = true
    this._pointing_self_count++
    this._tick_color()
  }

  private _onPointerLeave = (event: UnitPointerEvent) => {
    // console.log('Bot', '_onPointerLeave')
    const { pointerId } = event
    this.__onPointerLeave(pointerId)
  }

  private __onPointerLeave = (pointerId: number): void => {
    // console.log('Bot', '__onPointerLeave')

    delete this._pointing_self[pointerId]
    this._pointing_self_count--
    this._tick_color()
  }

  private _onContextPointerEnter = (event: UnitPointerEvent) => {
    const { pointerId, pointerType } = event

    if (
      (pointerType === 'pen' || pointerType === 'mouse') &&
      !this._pointer_down[pointerId]
    ) {
      return
    }

    this.__onContextPointerEnter(event)
  }

  private __onContextPointerEnter = (event: UnitPointerEvent) => {
    const { x, y } = this._getXY(event)
    const { pointerId } = event

    if (!this._pointer_inside[pointerId]) {
      // log('Bot', '_onContextPointerEnter', pointerId)

      this._pointer_inside[pointerId] = true
      this._pointer_enter_count++
      this._pointer_position[pointerId] = { x, y }
      this._pointer_visible = this._pointer_enter_count > 0

      if (this._synced) {
        this._synced = false
        this._start_sync()
      }

      this._tick_body()
    }
  }

  private _onContextPointerLeave = (event: UnitPointerEvent) => {
    const { pointerId } = event
    // log('Bot', '_onContextPointerLeave', pointerId)
    this.__onContextPointerLeave(event)
  }

  private __onContextPointerLeave = (event: UnitPointerEvent) => {
    const { pointerId, pointerType } = event

    if (this._dnd[pointerId]) {
      return
    }

    if (this._pointer_inside[pointerId]) {
      // log('Bot', '__onContextPointerLeave', pointerId)

      this._pointer_enter_count--

      if (this._pointer_down[pointerId]) {
        this._remove_pointer_down(event)
      }

      const position = this._pointer_position[pointerId]

      delete this._pointer_inside[pointerId]
      delete this._pointer_position[pointerId]

      this._removePointerLaser(pointerId)

      this._pointer_visible = this._pointer_enter_count > 0

      if (this._synced) {
        if (!this._pointer_visible) {
          this._synced = false

          this._start_sync()
        }
      }

      this._tick_body()
    }
  }

  private _onContextPointerCancel = (event: UnitPointerEvent) => {
    const { pointerId } = event
    // console.log('Bot', '_onContextPointerCancel', pointerId)
    this.__onContextPointerLeave(event)
  }

  private _onContextPointerMove = (event: UnitPointerEvent) => {
    // console.log('Bot', '_onContextPointerMove')

    const { pointerId, pointerType } = event

    let position = this._getXY(event)

    // ignore pen events for now because Samsung S-Pen hover does not emit
    // pointerenter/pointerleave events (tested on a Samsung Galaxy Note Ultra).
    if (
      (pointerType === 'pen' || pointerType === 'mouse') &&
      !this._pointer_down[pointerId]
    ) {
      return
    }

    // if (this._pointer_inside[pointerId]) {
    this._pointer_position[pointerId] = position
    if (this._pointer_down[pointerId] && this._synced) {
      this._laser_position[pointerId] = position
    }
    this._pointer_visible = this._pointer_enter_count > 0
    this._tick_body()
    // }
  }

  private _getXY = (event: UnitPointerEvent): Position => {
    // const { $x, $y, $sx, $sy, $rx, $ry, $rz } = this.$context

    // const { screenX, screenY } = event
    const { clientX, clientY } = event

    const rz_cos = Math.cos(-this._container_rz)
    const rz_sin = Math.sin(-this._container_rz)

    const sx = (clientX - this._container_x) / this._container_sx
    const sy = (clientY - this._container_y) / this._container_sy

    const x = sx * rz_cos - sy * rz_sin
    const y = sx * rz_sin + sy * rz_cos

    return { x, y }
  }

  private _onContextPointerDown = (event: UnitPointerEvent) => {
    const { pointerId, pointerType } = event

    if (!this._pointer_down[pointerId]) {
      // log('Bot', '_onContextPointerDown', pointerId)

      const position = this._getXY(event)

      this._pointer_down_count++
      this._pointer_down[pointerId] = true
      this._pointer_inside[pointerId] = true
      this._pointer_position[pointerId] = position
      this._pointer_down_position[pointerId] = position

      if (this._synced) {
        this._laser_position[pointerId] = position
      }

      this._tick_body()

      if (pointerType === 'pen' || pointerType === 'mouse') {
        this.__onContextPointerEnter(event)
      }
    }
  }

  private _laser_position: Position[] = []

  private _remove_pointer_down = (event: UnitPointerEvent): void => {
    // console.trace('Bot', '_remove_pointer_down')

    const {
      api: {
        window: { setTimeout },
      },
    } = this.$system

    const { mode } = this.$props

    const { pointerId, pointerType } = event

    this._pointer_down_count--

    delete this._pointer_down[pointerId]
    delete this._pointer_down_position[pointerId]

    // Chrome
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1147674
    if (pointerType === 'touch' || pointerType === 'pen') {
      delete this._pointer_position[pointerId]
    }

    const remove_laser = () => {
      if (!this._pointer_down[pointerId]) {
        this._removePointerLaser(pointerId)

        this._tick_body()
      }
    }

    setTimeout(() => {
      remove_laser()
    }, 90)
  }

  private _onContextPointerUp = (event: UnitPointerEvent) => {
    const { pointerId, pointerType } = event

    if (this._pointer_down[pointerId]) {
      // console.log('Bot', '_onContextPointerUp', pointerId)
      this._remove_pointer_down(event)

      if (pointerType === 'pen' || pointerType === 'mouse') {
        this._onContextPointerLeave(event)
      }
    }
  }

  private _removePointerLaser = (pointerId: number): void => {
    const laser = this._laser[pointerId]

    if (laser) {
      // log('Bot', '_removePointerLaser', pointerId)

      this._svg.removeChild(laser)

      delete this._laser_position[pointerId]
      delete this._laser[pointerId]
      delete this._laser_focus[pointerId]
      delete this._laser_ray[pointerId]
    }
  }

  private _width: number = 0
  private _height: number = 0

  private _onContextResize = () => {
    // console.log('Bot', '_onContextResize')
    const { $width, $height } = this.$context

    this._resizeSVG()

    this._translate()

    this._width = $width
    this._height = $height

    if (this._enabled()) {
      this._reset_move_timeout()
    }
  }

  private _resizeSVG = () => {
    const { $width, $height } = this.$context

    this._svg.setAttribute('width', `${$width}`)
    this._svg.setAttribute('height', `${$height}`)
  }

  private _translate = () => {
    // console.count('_translate')
    const { $width, $height } = this.$context
    const { r = DEFAULT_R } = this.$props

    const dw = $width - this._width
    const dh = $height - this._height

    const dx = dw / 2
    const dy = dh / 2

    this._x += dx
    this._y += dy

    const P = 3

    const D = 2 * r + P

    this._x = clamp(this._x, P, $width - D)
    this._y = clamp(this._y, P, $height - D)

    this._tick_body()
  }

  private _onContextEnabled = (): void => {
    // console.log('Bot', '_onContextEnabled')
    this._refresh_enabled()
  }

  private _onContextDisabled = (): void => {
    // console.log('Bot', '_onContextDisabled')
    this._refresh_enabled()
  }

  private _unlisten_context: Unlisten

  private _following = false

  private _dnd: Dict<boolean> = {}

  public _follow = (): void => {
    // console.log('Bot', '_follow')

    if (this._following) {
      return
    }

    this._following = true

    const pointerDownListener = makePointerDownListener(
      this._onContextPointerDown,
      true
    )
    const pointerUpListener = makePointerUpListener(
      this._onContextPointerUp,
      true
    )
    const pointerMoveListener = makePointerMoveListener(
      this._onContextPointerMove,
      true
    )
    const pointerEnterListener = makePointerEnterListener(
      this._onContextPointerEnter,
      true
    )
    const pointerLeaveListener = makePointerLeaveListener(
      this._onContextPointerLeave,
      true
    )
    const pointerCancelListener = makePointerCancelListener(
      this._onContextPointerCancel,
      true
    )

    // const enterModeListener = makeCustomListener(
    //   'entermode',
    //   ({ mode }) => {
    //     console.log('Bot', '_on_enter_mode')
    //     this.setProp('mode', mode)
    //   },
    //   true
    // )

    const graphEnterModeListener = makeCustomListener(
      '_graph_mode',
      ({ mode }) => {
        // console.log('Bot', '_on_graph_enter_mode')
        this.setProp('mode', mode)
      },
      true
    )

    this._unlisten_context = addListeners(this.$context, [
      pointerDownListener,
      pointerUpListener,
      pointerMoveListener,
      pointerEnterListener,
      pointerLeaveListener,
      pointerCancelListener,
      // enterModeListener,
      graphEnterModeListener,
    ])
  }

  private _get_color = (): { color: string; mode_color: string } => {
    const { $theme, $color } = this.$context
    const { style = {}, mode = DEFAULT_MODE } = this.$props
    const { color = $color } = style
    const mode_color = getThemeModeColor($theme, mode, color)
    return { color, mode_color }
  }

  private _tick_color = (): void => {
    // console.log('Bot', '_tick_color')

    const { mode = DEFAULT_MODE } = this.$props

    const { color, mode_color } = this._get_color()

    for (let i = 0; i < this._eye_ellipse.length; i++) {
      const eye_ellipse = this._eye_ellipse[i]
      if (
        // this._pointing_self_count > 0
        false
      ) {
        eye_ellipse.style.stroke = mode_color
      } else {
        eye_ellipse.style.stroke = color
      }
    }

    this._eye_brow.style.stroke = mode_color

    this._eye_ball.style.fill = mode_color
    this._eye_ball.style.stroke = mode_color

    for (const pointerId in this._laser_focus) {
      const laser_focus = this._laser_focus[pointerId]
      const laser_ray = this._laser_ray[pointerId]

      laser_focus.style.fill = mode_color
      laser_focus.style.stroke = mode_color

      laser_ray.style.stroke = mode_color
    }
  }

  public _unfollow = (): void => {
    if (!this._following) {
      return
    }
    // console.log('Bot', '_unfollow')

    this._following = false

    const unlisten = this._unlisten_context

    unlisten()
  }

  private _context_unlisten: Unlisten
  private _document_listener: Unlisten

  onMount() {
    // console.log('Bot', 'onMount')

    const { $width, $height } = this.$context

    const { r = DEFAULT_R, x, y } = this.$props

    if (x === undefined) {
      this._x = $width / 2 - r - 2
    }

    if (y === undefined) {
      this._y = $height / 2 - r - 2
    }

    this._width = $width
    this._height = $height

    this._tick_color()
    this._tick_body()

    this._refresh_enabled()

    this._document_listener = () => {
      this._refresh_enabled()
    }

    document.addEventListener(
      'visibilitychange',
      this._document_listener,
      false
    )

    this._context_unlisten = addListeners(this.$context, [
      makeResizeListener(this._onContextResize),
      makeCustomListener('themechanged', () => {
        // console.log('Bot', '_on_context_theme_changed')
        this._tick_color()
      }),
      makeCustomListener('colorchanged', () => {
        // console.log('Bot', '_on_context_theme_changed')
        this._tick_color()
      }),
    ])

    this._position_observer.observe(this._container)

    this._resizeSVG()
  }

  onUnmount($context: Context): void {
    const {} = $context

    this._disable()

    this._context_unlisten()

    if (this._move_animation_frame !== undefined) {
      cancelAnimationFrame(this._move_animation_frame)
      this._move_animation_frame = undefined
    }

    for (const pointerId in this._pointer_down) {
      this._removePointerLaser(Number.parseInt(pointerId))
    }

    this._pointer_position = {}
    this._pointer_down = {}
    this._pointer_occluded = {}
    this._pointer_down_count = 0
    this._pointer_enter_count = 0
    this._pointer_inside = {}
    this._pointer_visible = false

    this._position_observer.disconnect()

    document.removeEventListener('visibilitychange', this._document_listener)
  }

  onPropChanged(prop: string, current: any) {
    // console.log('Bot', prop, current)
    if (prop === 'style') {
      applyStyle(this._container, { ...DEFAULT_STYLE, ...current })
      this._tick_color()
    }
    if (prop === 'disabled') {
      this._refresh_enabled()
    } else if (prop === 'mode') {
      // this._tick_body()
      this._tick_color()
    } else if (prop === 'n') {
      this._tick_body()
    } else if (prop === 'r') {
      const prev = this._r || DEFAULT_R
      current = current || DEFAULT_R
      this._x += prev - current
      this._y += prev - current
      this._tick_body()
    } else if (prop === 'x') {
      const { r = DEFAULT_R } = this.$props

      if (typeof current === 'string') {
        current = parseLayoutValue(current)

        current = current[0] + (current[1] * this.$context.$width) / 100
      }

      this._x = current - r - 2

      this._tick_body()
    } else if (prop === 'y') {
      const { r = DEFAULT_R } = this.$props

      if (typeof current === 'string') {
        current = parseLayoutValue(current)

        current = current[0] + (current[1] * this.$context.$height) / 100
      }

      this._y = current - r - 2

      this._tick_body()
    }
  }
}
