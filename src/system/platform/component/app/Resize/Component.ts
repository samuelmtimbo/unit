import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: any
  disabled?: boolean
  l?: number
}

export type IOResizeEvent = {
  dx: number
  dy: number
  dw: number
  dh: number
  direction: Direction
  pointerId: number
}

export type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

export type DirectionUnit = -1 | 0 | 1

export default class Resize extends Element<HTMLDivElement, Props> {
  private _resize: HTMLDivElement

  private _x: Dict<DirectionUnit> = {}
  private _y: Dict<DirectionUnit> = {}

  private _resize_x: Dict<number> = {}
  private _resize_y: Dict<number> = {}

  private _pointer_down_count: number = 0
  private _pointer_down: Dict<boolean> = {}
  private _pointer_down_direction: Dict<Direction> = {}

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { disabled, l = 15 } = $props

    const resize = this.$system.api.document.createElement('div')
    resize.classList.add('resize')
    resize.style.top = '0'
    resize.style.position = 'initial'
    // resize.style.width = `100%`
    // resize.style.height = `100%`
    // resize.style.background = 'none'
    // resize.style.opacity = '0.5'
    resize.style.pointerEvents = disabled ? 'none' : 'all'

    const top = this.$system.api.document.createElement('div')
    top.classList.add('resize-top')
    top.style.position = 'absolute'
    top.style.width = '100%'
    top.style.height = `${l}px`
    top.style.top = `${-l}px`
    top.style.left = '0'
    top.style.cursor = 'n-resize'
    // top.style.backgroundColor = GREEN
    // top.style.opacity = '0.5'
    this._add_pointer_listener(top, 0, -1, 'n')
    resize.appendChild(top)

    const right = this.$system.api.document.createElement('div')
    right.classList.add('resize-right')
    right.style.position = 'absolute'
    right.style.width = `${l}px`
    right.style.height = '100%'
    right.style.top = '0'
    right.style.right = `${-l}px`
    right.style.cursor = 'e-resize'
    // right.style.backgroundColor = GREEN
    // right.style.opacity = '0.5'
    this._add_pointer_listener(right, 1, 0, 'e')
    resize.appendChild(right)

    const bottom = this.$system.api.document.createElement('div')
    bottom.classList.add('resize-bottom')
    bottom.style.position = 'absolute'
    bottom.style.width = '100%'
    bottom.style.height = `${l}px`
    bottom.style.bottom = `${-l}px`
    bottom.style.left = '0'
    bottom.style.cursor = 's-resize'
    // bottom.style.backgroundColor = GREEN
    // bottom.style.opacity = '0.5'
    this._add_pointer_listener(bottom, 0, 1, 's')
    resize.appendChild(bottom)

    const left = this.$system.api.document.createElement('div')
    left.classList.add('resize-left')
    left.style.position = 'absolute'
    left.style.width = `${l}px`
    left.style.height = '100%'
    left.style.top = '0'
    left.style.left = `${-l}px`
    left.style.cursor = 'w-resize'
    // left.style.backgroundColor = GREEN
    // left.style.opacity = '0.5'
    this._add_pointer_listener(left, -1, 0, 'w')
    resize.appendChild(left)

    const top_right = this.$system.api.document.createElement('div')
    top_right.classList.add('resize-top_right')
    top_right.style.position = 'absolute'
    top_right.style.width = `${l}px`
    top_right.style.height = `${l}px`
    top_right.style.top = `${-l}px`
    top_right.style.right = `${-l}px`
    top_right.style.cursor = 'ne-resize'
    // top_right.style.backgroundColor = BLUE
    // top_right.style.opacity = '0.5'
    this._add_pointer_listener(top_right, 1, -1, 'ne')
    resize.appendChild(top_right)

    const right_bottom = this.$system.api.document.createElement('div')
    right_bottom.classList.add('resize-right_bottom')
    right_bottom.style.position = 'absolute'
    right_bottom.style.width = `${l}px`
    right_bottom.style.height = `${l}px`
    right_bottom.style.right = `${-l}px`
    right_bottom.style.bottom = `${-l}px`
    right_bottom.style.cursor = 'se-resize'
    // right_bottom.style.backgroundColor = BLUE
    // right_bottom.style.opacity = '0.5'
    this._add_pointer_listener(right_bottom, 1, 1, 'se')
    resize.appendChild(right_bottom)

    const bottom_left = this.$system.api.document.createElement('div')
    bottom_left.classList.add('resize-bottom_left')
    bottom_left.style.position = 'absolute'
    bottom_left.style.width = `${l}px`
    bottom_left.style.height = `${l}px`
    bottom_left.style.bottom = `${-l}px`
    bottom_left.style.left = `${-l}px`
    bottom_left.style.cursor = 'sw-resize'
    // bottom_left.style.backgroundColor = BLUE
    // bottom_left.style.opacity = '0.5'
    this._add_pointer_listener(bottom_left, -1, 1, 'sw')
    resize.appendChild(bottom_left)

    const left_top = this.$system.api.document.createElement('div')
    left_top.classList.add('resize-left_top')
    left_top.style.position = 'absolute'
    left_top.style.width = `${l}px`
    left_top.style.height = `${l}px`
    left_top.style.left = `${-l}px`
    left_top.style.top = `${-l}px`
    left_top.style.cursor = 'nw-resize'
    // left_top.style.backgroundColor = BLUE
    // left_top.style.opacity = '0.5'
    this._add_pointer_listener(left_top, -1, -1, 'nw')
    resize.appendChild(left_top)

    this._resize = resize

    this.$element = resize
  }

  private _add_pointer_listener = (
    element: HTMLDivElement,
    x: DirectionUnit,
    y: DirectionUnit,
    direction: Direction
  ) => {
    element.addEventListener('pointerdown', (event) => {
      const { clientX, clientY, pointerId } = event

      element.setPointerCapture(pointerId)

      // event.stopPropagation()

      this._resize.style.position = 'absolute'
      this._resize.style.width = `100%`
      this._resize.style.height = `100%`

      this._x[pointerId] = x
      this._y[pointerId] = y

      this._resize_x[pointerId] = clientX
      this._resize_y[pointerId] = clientY

      this._pointer_down_count++
      this._pointer_down[pointerId] = true
      this._pointer_down_direction[pointerId] = direction

      const on_pointer_move = (event: PointerEvent) => {
        // console.log('Resize', 'on_pointer_move')
        const { pointerId } = event

        if (this._pointer_down[pointerId]) {
          const { clientX, clientY, pointerId } = event
          const dw = this._x[pointerId] * (clientX - this._resize_x[pointerId])
          const dh = this._y[pointerId] * (clientY - this._resize_y[pointerId])
          const dx = this._x[pointerId] * (dw / 2)
          const dy = this._y[pointerId] * (dh / 2)
          const direction = this._pointer_down_direction[pointerId]

          this._resize_x[pointerId] = clientX
          this._resize_y[pointerId] = clientY

          this.dispatchEvent('resized', {
            dx,
            dy,
            dw,
            dh,
            direction,
            pointerId,
          })
        }
      }

      const on_pointer_up = (event) => {
        const { pointerId } = event

        if (this._pointer_down[pointerId]) {
          this._pointer_down_count--
          delete this._pointer_down[pointerId]

          element.releasePointerCapture(pointerId)

          if (this._pointer_down_count === 0) {
            element.removeEventListener('pointermove', on_pointer_move)
            element.removeEventListener('pointerup', on_pointer_up)
            element.removeEventListener('pointercancel', on_pointer_up)

            this.dispatchEvent('resizeend', {})
            this._resize.style.position = 'initial'
            this._resize.style.width = '0'
            this._resize.style.height = '0'
          }
        }
      }

      if (this._pointer_down_count === 1) {
        // TODO use IO event system
        element.addEventListener('pointermove', on_pointer_move)
        element.addEventListener('pointerup', on_pointer_up)
        element.addEventListener('pointercancel', on_pointer_up)
      }

      this._dispatch_resize_start(pointerId, direction)
    })
  }

  private _dispatch_resize_start = (
    pointerId: number,
    direction: Direction
  ) => {
    this.dispatchEvent('resizestart', {
      dx: 0,
      dy: 0,
      dw: 0,
      dh: 0,
      direction,
      pointerId,
    } as IOResizeEvent)
  }

  onPropChanged(name: string, current: any) {
    // console.log('Resize', 'onPropChanged', name, current)

    if (name === 'disabled') {
      if (current === true) {
        this._resize.style.pointerEvents = 'none'
      } else if (current === false) {
        this._resize.style.pointerEvents = 'inherit'
      }
    }
  }
}
