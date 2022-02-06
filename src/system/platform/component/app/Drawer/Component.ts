import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_T_MS } from '../../../../../client/animation/animation'
import applyStyle, { mergeStyle } from '../../../../../client/applyStyle'
import classnames from '../../../../../client/classnames'
import debounce from '../../../../../client/debounce'
import { Element } from '../../../../../client/element'
import { IOPointerEvent } from '../../../../../client/event/pointer'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { makeResizeListener } from '../../../../../client/event/resize'
import parentElement from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE } from '../../../../../client/theme'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import Div from '../../Div/Component'
import Frame from '../../Frame/Component'
import Icon from '../../Icon/Component'

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
  private _column: Div

  private _active: boolean = false
  private _hidden: boolean = false

  private _hover: boolean = false
  private _y: number = 0

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

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
    } = this.$props

    this._active = active
    this._hidden = hidden

    this._y = 0

    const { backgroundColor = 'inherit' } = style

    const knob = new Icon(
      {
        className: 'drawer-knob',
        icon,
        active,
        style: {
          position: 'absolute',
          top: '0',
          padding: '6px',
          transform: 'translateX(-100%)',
          height: `${KNOB_HEIGHT - 12 - 2}px`,
          width: `${KNOB_HEIGHT - 12 - 2}px`,
          touchAction: 'none',
          boxShadow:
            'inset 1px 0 0 0 currentColor, inset -1px 0 0 0 #00000000, inset 0 1px 0 0 currentColor, inset 0 -1px 0 0 currentColor',
          backgroundColor,
          cursor: 'pointer',
        },
        title,
      },
      this.$system,
      this.$pod
    )
    knob.addEventListener(
      makeClickListener({
        onClick: this._on_knob_click,
      })
    )
    knob.addEventListener(makePointerEnterListener(this._on_knob_pointer_enter))
    knob.addEventListener(makePointerLeaveListener(this._on_knob_pointer_leave))
    knob.addEventListener(makePointerDownListener(this._on_knob_pointer_down))
    knob.preventDefault('mousedown')
    knob.preventDefault('touchdown')
    this._knob = knob

    const frame = new Frame(
      {
        className: 'drawer-frame',
        style: {
          position: 'absolute',
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
      this.$system,
      this.$pod
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
          boxShadow:
            'inset 1px 0 0 0 #00000000, inset -1px 0 0 0 currentColor, inset 0 1px 0 0 currentColor, inset 0 -1px 0 0 currentColor',
          // borderLeftColor: NONE,
          boxSizing: 'border-box',
          borderRadius: '0px',
          borderBottomLeftRadius: '1px',
          minHeight: '35px',
          padding: component ? '3px' : '0',
          // padding: '3px',
        },
      },
      this.$system,
      this.$pod
    )
    content.registerParentRoot(frame)
    this.content = content

    const column = new Div(
      {
        className: 'drawer-column',
        style: {
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          width: '0px',
          height: 'calc(100% - 32px)',
          backgroundColor: 'none',
          borderWidth: '0px 1px 0px 0px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
        },
      },
      this.$system,
      this.$pod
    )
    this._column = column

    const drawer = new Div(
      {
        className: classnames('drawer', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    this.drawer = drawer
    drawer.registerParentRoot(knob)
    drawer.registerParentRoot(content)
    drawer.registerParentRoot(column)

    const $element = parentElement($system)

    this.$subComponent = {
      drawer,
      knob,
      content,
      column,
    }

    this.$element = $element
    this.$slot = drawer.$slot
    this.$unbundled = false

    this.registerRoot(drawer)
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

      // @ts-ignore
      this._knob.$slot['default'].$element.style.backgroundColor =
        backgroundColor
    } else if (prop === 'active') {
      // this._setActive(current)
      this.setActive(current)
    } else if (prop === 'y') {
      this._y = current
      this.drawer.$element.style.top = `${this._y}px`
    } else if (prop === 'width') {
      this._resize()
    } else if (prop === 'height') {
      this._resize()
    } else if (prop === 'hidden') {
      // this._resize()
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
      translateX = -translateX + 34
    }

    return translateX
  }

  private _setActive = (active: boolean) => {
    this._active = active
    this._knob.setProp('active', active)
    this._animate_transform(true)
  }

  private _translate = (): void => {
    const transform = this._transform()

    this.drawer.$element.style.transform = transform
  }

  private _resize = (): void => {
    console.log('Drawer', '_resize')

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

  private _on_knob_click = (event: IOPointerEvent) => {
    this.setActive(!this._active)
  }

  private _on_knob_pointer_enter = (event: IOPointerEvent) => {
    this._hover = true
  }

  private _on_knob_pointer_leave = (event: IOPointerEvent) => {
    this._hover = false
  }

  private _drag: boolean = false
  private _drag_dy: number = 0
  private _drag_pointer_id: number

  private _clamp_top = (top: number): number => {
    const { $height } = this.$context
    return Math.max(Math.min(top, $height - KNOB_HEIGHT), 0)
  }

  private _on_knob_pointer_down = (event: IOPointerEvent) => {
    // log('Drawer', '_on_knob_pointer_down')

    const { clientY, pointerId } = event

    this._knob.setPointerCapture(pointerId)

    this._drag_dy = this._y - clientY
    this._drag = true
    this._drag_pointer_id = pointerId

    const unlisten_knob = this._knob.addEventListeners([
      makePointerMoveListener((event: IOPointerEvent) => {
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
      makePointerUpListener((event: IOPointerEvent) => {
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

  private _on_container_resize = debounce(() => {
    if (this._active) {
      this._resize()
    }
  }, 300)

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

  private _animate = (style: Dict<string>, animate: boolean): void => {
    const duration = animate ? ANIMATION_T_MS : 0
    const fill = 'forwards'

    this.drawer.$element.animate([style], {
      duration,
      fill,
    }).onfinish = () => {
      mergeStyle(this.drawer.$element, style)
    }
  }

  private _animate_transform = (animate: boolean): void => {
    const transform = this._transform()

    this._animate(
      {
        transform,
      },
      animate
    )
  }

  public show(animate: boolean): void {
    this._hidden = false

    this._animate_transform(animate)
  }

  public hide(animate: boolean): void {
    this._hidden = true

    this._animate_transform(animate)
  }
}
