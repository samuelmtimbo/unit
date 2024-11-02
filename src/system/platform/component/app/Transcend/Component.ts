import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_C } from '../../../../../client/animation/ANIMATION_C'
import { ANIMATION_T_S } from '../../../../../client/animation/ANIMATION_T_S'
import { mergePropStyle } from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { LONG_CLICK_TIMEOUT } from '../../../../../client/event/pointer/constants'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import {
  IOFrameResizeEvent,
  makeResizeListener,
} from '../../../../../client/event/resize'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import {
  DIM_OPACITY,
  whenInteracted,
} from '../../../../../client/whenInteracted'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { clamp } from '../../../../core/relation/Clamp/f'
import Div from '../../Div/Component'
import Icon from '../../Icon/Component'
import Tooltip from '../Tooltip/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  down?: boolean
}

export const TRANSCEND_WIDTH = 33
export const TRANSCEND_HEIGHT = TRANSCEND_WIDTH
export const TRANSCEND_BORDER_RADIUS = TRANSCEND_WIDTH / 2
export const TRANSCEND_PULL_DY = TRANSCEND_HEIGHT / 2

export const DEFAULT_STYLE = {
  position: 'absolute',
  top: '0px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: `${TRANSCEND_WIDTH}px`,
  height: `${TRANSCEND_HEIGHT}px`,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderBottomLeftRadius: `${TRANSCEND_BORDER_RADIUS}px`,
  borderBottomRightRadius: `${TRANSCEND_BORDER_RADIUS}px`,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  touchAction: 'none',
  alignItems: 'center',
  zIndex: '1',
  // borderTop: 'none',
  marginTop: '-4px',
  // transition: 'top ${ANIMATION_T_S}s linear',
  transition: `opacity ${ANIMATION_T_S}s linear`,
}

export default class Transcend extends Element<HTMLDivElement, Props> {
  public _container: Div
  public _icon: Icon

  private _tooltip: Tooltip

  private _x: number = 0
  private _y: number = 0

  private _y_target: number = 0
  private _y_animation: number

  private _pull_tick_count: number = 0
  private _pull_tick_frame: number

  private _pointer_down_id: number

  private _hidden: boolean = true
  private _down: boolean = false

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {}, down = false } = this.$props

    const icon = new Icon(
      {
        icon: 'chevron-up',
        style: {
          transform: down
            ? `rotate3d(1, 0, 0, 180deg)`
            : `rotate3d(1, 0, 0, 0deg)`,
          width: '24px',
          height: '24px',
          alignSelf: 'end',
          marginBottom: '4px',
        },
      },
      this.$system
    )
    this._icon = icon

    const left = this._get_style_left()

    const container = new Div(
      {
        style: {
          ...DEFAULT_STYLE,
          ...style,
          left,
        },
        title: 'transcend',
      },
      this.$system
    )
    container.preventDefault('mousedown')
    container.preventDefault('touchdown')

    container.registerParentRoot(icon)
    container.addEventListeners([
      makePointerDownListener(({ pointerId, clientX, clientY: _clientY }) => {
        // log('Transcend', '_on_pointer_down')

        let _clientX = clientX - this._x

        container.setPointerCapture(pointerId)

        this._pointer_down_id = pointerId

        const unlisten = container.addEventListeners([
          makePointerMoveListener(({ clientX, clientY }) => {
            const _dy = clientY - _clientY

            const tx = clientX - _clientX
            const ty = clamp(_dy, 0, TRANSCEND_PULL_DY)

            const dx = tx - this._x
            const dy = ty - this._y

            this._translate(tx, ty)

            if (Math.abs(dx) > 0.1 || dy < 0) {
              this._pull_tick_count = 0
            }

            if (dy < 0) {
              this._cancel_pull_tick_frame()
            }

            if (ty >= TRANSCEND_PULL_DY) {
              this._start_pull_timer()
            }
          }),
          makePointerUpListener(() => {
            container.releasePointerCapture(pointerId)

            this._translate(this._x, 0)

            this._cancel_pull_tick_frame()

            this._pointer_down_id = undefined

            unlisten()
          }),
          makePointerLeaveListener(() => {
            container.releasePointerCapture(pointerId)

            this._cancel_pull_tick_frame()

            this._pointer_down_id = undefined

            this._translate(this._x, 0)

            unlisten()
          }),
        ])
      }),
    ])
    const reset_dim = () => {
      let on_active = (): void => {
        mergePropStyle(container, {
          opacity: '1',
        })
      }
      let on_inactive = (): void => {
        if (!this._down) {
          return
        }

        mergePropStyle(container, {
          opacity: `${DIM_OPACITY}`,
        })
      }
      const unlisten_interacted = whenInteracted(
        container,
        3000,
        true,
        on_active,
        on_inactive
      )
      on_active()
    }
    reset_dim()
    this._container = container

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = container.$slot
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      container,
      icon,
    })

    this.registerRoot(container)

    this._refresh_style()
  }

  private _get_style_left = (): string => {
    return `calc(50% + ${this._x + 3}px)`
  }

  private _get_style = () => {
    const { style } = this.$props

    const left = this._get_style_left()

    let top: string

    let height = `${TRANSCEND_HEIGHT}px`

    if (this._y > 0) {
      top = `${0}px`

      height = `${TRANSCEND_HEIGHT + this._y}px`
    } else {
      top = `${this._y}px`
    }

    return {
      ...DEFAULT_STYLE,
      ...style,
      left,
      top,
      height,
    }
  }

  private _refresh_style = () => {
    // console.log('Transcend', '_refresh_style')
    const style = this._get_style()

    this._container.setProp('style', style)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._refresh_style()
    }
  }

  private _cancel_pull_tick_frame = () => {
    const {
      api: {
        animation: { cancelAnimationFrame },
      },
    } = this.$system

    cancelAnimationFrame(this._pull_tick_frame)

    this._pull_tick_frame = undefined
  }

  private _pull_tick = () => {
    const {
      api: {
        animation: { requestAnimationFrame, cancelAnimationFrame },
      },
    } = this.$system

    this._pull_tick_count++

    if (this._pointer_down_id) {
      if (this._pull_tick_count === 4 * LONG_CLICK_TIMEOUT) {
        this._pull_tick_count = 0

        this._container.releasePointerCapture(this._pointer_down_id)

        this._pointer_down_id = undefined
        this._pull_tick_frame = undefined

        this.dispatchEvent('transcend', {}, true)
      } else {
        this._pull_tick_frame = requestAnimationFrame(this._pull_tick)
      }
    }
  }

  private _start_pull_timer = () => {
    this._pull_tick()
  }

  private _translate = (x: number, y: number): void => {
    const { $width } = this.$context

    if ($width === 0) {
      return
    }

    this._x = clamp(
      x,
      TRANSCEND_WIDTH / 2 - $width / 2 + 0,
      $width / 2 - TRANSCEND_WIDTH / 2 - 3 - 3
    )
    this._y = y

    this._refresh_style()
  }

  private _context_unlisten: Unlisten

  onMount() {
    // console.log('Transcend', 'onMount')
    const {} = this.$context

    this._translate(this._x, this._y)

    this._context_unlisten = addListeners(this.$context, [
      makeResizeListener(this._on_context_resize),
    ])
  }

  onUnmount() {
    // console.log('Transcend', 'onUnmount')
    this._context_unlisten()
  }

  private _on_context_resize = ({
    width,
    height,
  }: IOFrameResizeEvent): void => {
    // console.log('Transcend', '_on_context_resize', width, height)

    this._translate(this._x, this._y)
  }

  public up(animate: boolean = true) {
    // console.log('Transcend', 'up')

    if (!this._down) {
      return
    }

    this._down = false

    mergePropStyle(this._icon, {
      transform: `rotate3d(1, 0, 0, 0deg)`,
      transition: animate ? `transform ${ANIMATION_T_S}s linear` : '',
    })
  }

  public down(animate: boolean = true) {
    // console.log('Transcend', 'down')

    if (this._down) {
      return
    }

    this._down = true

    mergePropStyle(this._icon, {
      transform: `rotate3d(1, 0, 0, 180deg)`,
      transition: animate ? `transform ${ANIMATION_T_S}s linear` : '',
    })
  }

  private _animate_y = (target_y: number): void => {
    const {
      api: {
        animation: { requestAnimationFrame, cancelAnimationFrame },
      },
    } = this.$system

    this._y_target = target_y

    if (this._y_animation) {
      cancelAnimationFrame(this._y_animation)
    }

    const dy0 = this._y_target - this._y

    const k = ((dy0 / 12) * ANIMATION_T_S) / 0.2

    const anim = () => {
      const dy = this._y_target - this._y

      const k = dy / (6 * ANIMATION_C)

      if (Math.abs(dy) >= 1) {
        this._y += k

        this._y_animation = requestAnimationFrame(anim)
      } else {
        this._y = this._y_target
      }

      mergePropStyle(this._container, {
        top: `${this._y}px`,
      })
    }

    this._y_animation = requestAnimationFrame(anim)
  }

  public hide(animate: boolean = true) {
    // console.log('Transcend', 'hide', animate)
    this._hidden = true

    if (animate) {
      this._animate_y(-TRANSCEND_HEIGHT)
    } else {
      this._y = -TRANSCEND_HEIGHT

      mergePropStyle(this._container, {
        top: `${this._y}px`,
      })
    }
  }

  public show(animate: boolean = true) {
    // console.log('Transcend', 'show', animate)
    this._hidden = false

    if (animate) {
      this._animate_y(0)
    } else {
      this._y = 0

      mergePropStyle(this._container, {
        top: `${this._y}px`,
      })
    }
  }
}
