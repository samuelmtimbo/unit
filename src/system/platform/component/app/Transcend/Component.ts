import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_T_S } from '../../../../../client/animation/ANIMATION_T_S'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import {
  IOFrameResizeEvent,
  makeResizeListener,
} from '../../../../../client/event/resize'
import parentElement from '../../../../../client/platform/web/parentElement'
import {
  DIM_OPACITY,
  whenInteracted,
} from '../../../../../client/whenInteracted'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../types/global/dom'
import { Unlisten } from '../../../../../types/Unlisten'
import clamp from '../../../../core/relation/Clamp/f'
import Div from '../../Div/Component'
import Icon from '../../Icon/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  down?: boolean
}

export const TRANSCEND_WIDTH = 33
export const TRANSCEND_HEIGHT = TRANSCEND_WIDTH

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
  borderBottomLeftRadius: '50%',
  borderBottomRightRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  touchAction: 'none',
  alignItems: 'center',
  // borderTop: 'none',
  marginTop: '-4px',
  // transition: 'top ${ANIMATION_T_S}s linear',
  transition: `opacity ${ANIMATION_T_S}s linear`,
}

export default class Transcend extends Element<IHTMLDivElement, Props> {
  public _container: Div
  public _icon: Icon

  private _x: number = 0

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {}, down } = this.$props

    const icon = new Icon(
      {
        icon: 'chevron-up',
        style: {
          transform: down
            ? `rotate3d(1, 0, 0, 180deg)`
            : `rotate3d(1, 0, 0, 180deg)`,
          width: '24px',
          height: '24px',
        },
      },
      this.$system,
      this.$pod
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
      this.$system,
      this.$pod
    )
    container.registerParentRoot(icon)
    container.addEventListeners([
      makePointerDownListener(({ pointerId, clientX }) => {
        // log('Transcend', '_on_pointer_down')
        let _clientX = clientX - this._x
        container.setPointerCapture(pointerId)
        const unlisten = container.addEventListeners([
          makePointerMoveListener(({ clientX }) => {
            this._translate(clientX - _clientX)
          }),
          makePointerUpListener(() => {
            container.releasePointerCapture(pointerId)
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
    this.$subComponent = {
      container,
      icon,
    }
    this.$unbundled = false

    this.registerRoot(container)

    this._refresh_style()
  }

  private _get_style_left = (): string => {
    return `calc(50% + ${this._x + 3}px)`
  }

  private _get_style = () => {
    const { style } = this.$props

    const left = this._get_style_left()

    const top = `${this._y}px`

    return {
      ...DEFAULT_STYLE,
      ...style,
      left,
      top,
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

  private _translate = (x: number): void => {
    // console.log('Transcend', '_translate', x)

    const { $width } = this.$context

    this._x = clamp({
      a: x,
      min: TRANSCEND_WIDTH / 2 - $width / 2 + 0,
      max: $width / 2 - TRANSCEND_WIDTH / 2 - 3 - 3,
    }).a

    this._refresh_style()
  }

  private _context_unlisten: Unlisten

  onMount() {
    // console.log('Transcend', 'onMount')
    const {} = this.$context

    this._translate(this._x)

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
    const { $width } = this.$context
    // console.log('Transcend', '_on_context_resize', width, height)
    const dw = width - $width
    const dw2 = dw / 2
    // this._translate(this._x + dw2)
    this._translate(this._x)
  }

  private _hidden: boolean = false

  private _down: boolean = false

  public up(animate: boolean = true) {
    // console.log('Transcend', 'up')
    this._down = false
    mergePropStyle(this._icon, {
      transform: `rotate3d(1, 0, 0, 0deg)`,
      transition: animate ? `transform ${ANIMATION_T_S}s linear` : '',
    })
  }

  public down(animate: boolean = true) {
    // console.log('Transcend', 'down')
    this._down = true

    mergePropStyle(this._icon, {
      transform: `rotate3d(1, 0, 0, 180deg)`,
      transition: animate ? `transform ${ANIMATION_T_S}s linear` : '',
    })
  }

  private _y: number = 0

  private _y_target: number = 0

  private _y_animation: number

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

      if (Math.abs(dy) > 1) {
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
