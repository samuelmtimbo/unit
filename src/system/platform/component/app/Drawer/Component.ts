import { addListeners } from '../../../../../client/addListener'
import {
  ANIMATION_T_MS,
  ifLinearTransition,
} from '../../../../../client/animation/animation'
import { classnames } from '../../../../../client/classnames'
import { debounce } from '../../../../../client/debounce'
import { Element } from '../../../../../client/element'
import { UnitPointerEvent } from '../../../../../client/event/pointer'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { makeResizeListener } from '../../../../../client/event/resize'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { applyStyle, mergeStyle } from '../../../../../client/style'
import { COLOR_NONE } from '../../../../../client/theme'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import Div from '../../Div/Component'
import Frame from '../../Frame/Component'
import Icon from '../../Icon/Component'
import Tooltip from '../Tooltip/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  title?: string
  height?: number
  width?: number
  component?: Element
  icon?: string
  active?: boolean
  hidden?: boolean
  y?: number
  shortcut?: string
}

export const KNOB_HEIGHT = 35

const DEFAULT_STYLE = {
  position: 'absolute',
  width: 'fit-content',
  height: 'fit-content',
  touchAction: 'none',
}

export default class Drawer extends Element<HTMLDivElement, Props> {
  public drawer: Div

  public content: Div

  public frame: Frame

  private _knob: Icon

  private _tooltip: Tooltip

  private _active: boolean = false
  private _hidden: boolean = false

  private _hover: boolean = false
  private _y: number = 0

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style = {},
      icon,
      title,
      component,
      active = false,
      hidden = false,
      y = 0,
      width = 0,
      height = KNOB_HEIGHT,
      shortcut,
    } = this.$props

    this._active = active
    this._hidden = hidden

    this._y = 0

    const { backgroundColor = 'inherit' } = style

    const knob = new Icon(
      {
        className: 'drawer-knob',
        icon,
        style: {
          position: 'absolute',
          top: '0',
          padding: '6px',
          transform: 'translateX(-100%)',
          height: `${KNOB_HEIGHT - 12 - 1}px`,
          width: `${KNOB_HEIGHT - 12 - 1}px`,
          touchAction: 'none',
          // boxShadow:
          //   'inset 1px 0 0 0 currentColor, inset -1px 0 0 0 #00000000, inset 0 1px 0 0 currentColor, inset 0 -1px 0 0 currentColor',
          backgroundColor,
          cursor: 'pointer',
          borderTopLeftRadius: '3px',
          borderBottomLeftRadius: '3px',
          borderWidth: '1px 0px 1px 1px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          borderBottom: '0',
        },
        title,
      },
      this.$system
    )
    this._knob = knob

    const tooltip = new Tooltip(
      {
        shortcut,
      },
      this.$system
    )
    this._tooltip = tooltip

    const frame = new Frame(
      {
        className: 'drawer-frame',
        style: {
          position: 'relative',
          width: `${width + 2}px`,
          height: `${height + 2}px`,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLOR_NONE,
          borderRadius: '1px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      },
      this.$system
    )
    this.frame = frame

    const content = new Div(
      {
        className: 'drawer-content',
        style: {
          display: 'flex',
          width: component ? `${width + 2 + 6}px` : '0',
          height: `${height + 2 + 6}px`,
          // borderWidth: component ? '1px' : '0',
          // borderStyle: 'solid',
          // borderColor: 'currentColor',
          // boxShadow:
          //   'inset 1px 0 0 0 #00000000, inset -1px 0 0 0 currentColor, inset 0 1px 0 0 currentColor, inset 0 -1px 0 0 currentColor',
          // borderLeftColor: NONE,
          borderTop: '1px solid currentColor',
          boxSizing: 'border-box',
          borderRadius: '0px',
          borderBottomLeftRadius: '1px',
          minHeight: '35px',
          padding: component ? '3px' : '0',
          // padding: '3px',
        },
      },
      this.$system
    )
    content.registerParentRoot(frame)
    this.content = content

    const container = new Div(
      {
        className: 'drawer-column',
        style: {
          width: 'fit-content',
          height: 'fit-content',
        },
      },
      this.$system
    )

    const notch = new Div(
      {
        className: 'drawer-knob-notch-bottom',
        style: {
          position: 'absolute',
          bottom: '0px',
          left: '-30px',
          top: '31px',
          width: '27px',
          height: '4px',
          backgroundColor: 'none',
          borderWidth: '0px 0px 1px 0px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          boxSizing: 'border-box',
          cursor: 'pointer',
        },
      },
      this.$system
    )

    const notch0 = new Div(
      {
        className: 'drawer-knob-notch-bottom-left',
        style: {
          position: 'absolute',
          bottom: '0px',
          left: '-35px',
          top: '31px',
          width: '5px',
          height: '4px',
          backgroundColor: 'none',
          borderWidth: '0px 0px 1px 1px',
          borderBottomLeftRadius: '3px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          boxSizing: 'border-box',
          cursor: 'pointer',
        },
      },
      this.$system
    )

    container.addEventListener(
      makeClickListener({
        onClick: this._on_knob_click,
      })
    )
    container.addEventListener(
      makePointerEnterListener(this._on_knob_pointer_enter)
    )
    container.addEventListener(
      makePointerLeaveListener(this._on_knob_pointer_leave)
    )
    container.addEventListener(
      makePointerDownListener(this._on_knob_pointer_down)
    )

    container.preventDefault('mousedown')
    container.preventDefault('touchdown')

    container.registerParentRoot(knob)
    container.registerParentRoot(notch)
    container.registerParentRoot(notch0)

    const column = new Div(
      {
        className: 'drawer-column',
        style: {
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          width: '4px',
          height: 'calc(100% - 38px)',
          backgroundColor: 'none',
          borderWidth: '0px 0px 1px 1px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          borderBottomLeftRadius: '3px',
          boxSizing: 'border-box',
        },
      },
      this.$system
    )

    const row = new Div(
      {
        className: 'drawer-row',
        style: {
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          width: 'calc(100% - 3px)',
          height: '3px',
          backgroundColor: 'none',
          borderWidth: '0px 1px 0px 0px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          borderBottom: '1px solid currentColor',
          boxSizing: 'border-box',
        },
      },
      this.$system
    )

    const notch1 = new Div(
      {
        className: 'drawer-armpit-top-right',
        style: {
          position: 'absolute',
          left: '21px',
          bottom: '-10px',
          width: '10px',
          height: '10px',
          backgroundColor: 'none',
          borderWidth: '1px 1px 0px 0px',
          borderTopRightRadius: '3px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          boxSizing: 'border-box',
        },
      },
      this.$system
    )

    const drawer = new Div(
      {
        className: classnames('drawer', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system
    )
    this.drawer = drawer
    drawer.registerParentRoot(container)
    drawer.registerParentRoot(content)
    drawer.registerParentRoot(column)
    drawer.registerParentRoot(row)
    notch.registerParentRoot(notch1)

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = drawer.$slot
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      drawer,
      knob,
      content,
      column,
      tooltip,
    })

    this.registerRoot(drawer)
    this.registerRoot(tooltip)
  }

  private _drawer_style = (): Dict<string> => {
    const { style = {} } = this.$props

    return {
      ...DEFAULT_STYLE,
      top: `${this._y}px`,
      transform: this._transform(),
      ...style,
    }
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Drawer', 'onPropChanged', prop, current)
    if (prop === 'className') {
      this.drawer.setProp('className', current)
    } else if (prop === 'style') {
      const style = this._drawer_style()

      applyStyle(this.drawer.$element, style)

      const { backgroundColor = COLOR_NONE } = style

      this._knob.$slot['default'].$element.style.backgroundColor =
        backgroundColor
    } else if (prop === 'active') {
      this.setActive(current)
    } else if (prop === 'y') {
      this._y = current
      this.drawer.$element.style.top = `${this._y}px`
    } else if (prop === 'width') {
      this._resize()
    } else if (prop === 'height') {
      this._resize()
    } else if (prop === 'hidden') {
      this._translate()
    }
  }

  private setActive = (active: boolean): void => {
    if (active) {
      if (this._active) {
        return
      }
      this._setActive(true)
      this.dispatchEvent('active', {})
    } else {
      if (!this._active) {
        return
      }
      this._setActive(false)
      this.dispatchEvent('inactive', {})
    }
  }

  private _transform = (): string => {
    const translateX = this._get_translate_x()

    return `translateX(${translateX}px)`
  }

  private _get_translate_x = (): number => {
    const { $width } = this.$context
    const { width = 0, component } = this.$props

    let translateX: number = 0

    if (this._active) {
      translateX = -Math.min(
        component ? width + 2 + 6 - 1 : 0,
        $width - KNOB_HEIGHT
      )
    }

    if (this._hidden) {
      translateX = -translateX + 34 + 1
    }

    return translateX
  }

  private _setActive = (active: boolean) => {
    const {
      api: {
        window: { setTimeout },
      },
    } = this.$system

    this._active = active

    this._animate_transform(true)

    setTimeout(() => {
      this.dispatchEvent('activated', {})
    }, ANIMATION_T_MS + 100)
  }

  private _translate = (): void => {
    const transform = this._transform()

    this.drawer.$element.style.transform = transform
  }

  private _resize = (): void => {
    // console.log('Drawer', '_resize')

    const { $width } = this.$context
    const { width = 0, height = KNOB_HEIGHT, component } = this.$props

    this._translate()

    if (width > $width - KNOB_HEIGHT) {
      this.frame.$element.style.width = `${$width - KNOB_HEIGHT - 8}px`
      this.frame.$element.style.height = `${height + 2}px`

      this.content.$element.style.width = component
        ? `${$width - KNOB_HEIGHT}px`
        : '0'
      this.content.$element.style.height = `${height + 6}px`
    } else {
      this.frame.$element.style.width = `${width + 2}px`
      this.frame.$element.style.height = `${height + 2}px`

      this.content.$element.style.width = component ? `${width + 2 + 6}px` : '0'
      this.content.$element.style.height = `${height + 2 + 6}px`
    }
  }

  private _on_knob_click = (event: UnitPointerEvent) => {
    this.setActive(!this._active)
  }

  private _on_knob_pointer_enter = (event: UnitPointerEvent) => {
    this._hover = true
  }

  private _on_knob_pointer_leave = (event: UnitPointerEvent) => {
    this._hover = false
  }

  private _drag: boolean = false
  private _drag_dy: number = 0
  private _drag_pointer_id: number

  private _clamp_top = (top: number): number => {
    const { $height } = this.$context
    return Math.max(Math.min(top, $height - KNOB_HEIGHT), 0)
  }

  private _on_knob_pointer_down = (event: UnitPointerEvent) => {
    // log('Drawer', '_on_knob_pointer_down')

    const { clientY, pointerId } = event

    this._knob.setPointerCapture(pointerId)

    this._drag_dy = this._y - clientY
    this._drag = true
    this._drag_pointer_id = pointerId

    const unlisten_knob = this._knob.addEventListeners([
      makePointerMoveListener((event: UnitPointerEvent) => {
        if (this._drag) {
          const { pointerId } = event
          if (this._drag_pointer_id === pointerId) {
            // console.log('Drawer', '_on_knob_pointer_move')
            const { clientY } = event

            this._y = this._clamp_top(clientY + this._drag_dy)

            this.drawer.$element.style.top = `${this._y}px`

            this.dispatchEvent('dragged', { y: this._y })
          }
        }
      }),
      makePointerUpListener((event: UnitPointerEvent) => {
        // log('Drawer', '_on_knob_pointer_up')
        const { pointerId } = event
        if (this._drag_pointer_id === pointerId) {
          this._drag = false

          this._knob.releasePointerCapture(pointerId)

          unlisten_knob()

          this.dispatchEvent('dragend', {})
        }
      }),
      makePointerCancelListener(() => {
        // log('Drawer', '_on_knob_pointer_cancel')
      }),
    ])

    this.dispatchEvent('dragstart', { y: this._y })
  }

  private _on_container_resize = debounce(
    this.$system,
    () => {
      if (this._active) {
        this._resize()
      }
    },
    300
  )

  private _frame_listener: Unlisten

  onMount() {
    // console.log('Drawer', 'onMount')
    this._frame_listener = addListeners(this.$context, [
      makeResizeListener(this._on_container_resize),
    ])
  }

  onUnmount() {
    this._frame_listener()
  }

  private _animation: Animation

  private _animate = (style: Dict<string>, animate: boolean): void => {
    const duration = animate ? ANIMATION_T_MS : 0

    const fill = 'forwards'

    if (this._animation) {
      this._animation.pause()
      this._animation.commitStyles()
    }

    this._animation = this.drawer.$element.animate?.([style], {
      duration,
      fill,
    })

    this._animation.onfinish = () => {
      mergeStyle(this.drawer.$element, style)

      this._animation = undefined
    }
  }

  private _animate_transform = (animate: boolean): void => {
    // console.log('Drawer', '_animate_transform', animate)

    const transform = this._transform()

    // this._animate(
    //   {
    //     transform,
    //   },
    //   animate
    // )

    mergeStyle(this.drawer.$element, {
      transform,
      transition: ifLinearTransition(animate, 'transform'),
    })
  }

  public show(animate: boolean): void {
    // console.log('Drawer', 'show', animate)

    this._hidden = false

    this._animate_transform(animate)
  }

  public hide(animate: boolean): void {
    this._hidden = true

    this._animate_transform(animate)
  }

  public show_tooltip = () => {
    const bbox = this._knob.getBoundingClientRect()

    this._tooltip.show(bbox.x - 30 - 3, bbox.y + 4.5)
  }

  public hide_tooltip = () => {
    this._tooltip.hide()
  }
}
