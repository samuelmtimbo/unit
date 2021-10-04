import IconButton from '../../../system/platform/component/core/IconButton/Component'
import Div from '../../../system/platform/component/Div/Component'
import Frame from '../../../system/platform/component/Frame/Component'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../Unlisten'
import { addListeners } from '../../addListener'
import classnames from '../../classnames'
import debounce from '../../debounce'
import { Element } from '../../element'
import { IOPointerEvent } from '../../event/pointer'
import { makeClickListener } from '../../event/pointer/click'
import { makePointerCancelListener } from '../../event/pointer/pointercancel'
import { makePointerDownListener } from '../../event/pointer/pointerdown'
import { makePointerEnterListener } from '../../event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../event/pointer/pointerleave'
import { makePointerMoveListener } from '../../event/pointer/pointermove'
import { makePointerUpListener } from '../../event/pointer/pointerup'
import { makeResizeListener } from '../../event/resize'
import parentElement from '../../parentElement'
import { NONE } from '../../theme'
// import mergeStyle from '../mergeStyle'

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
  // transition: 'transform 0.2s linear',
}

export default class Drawer extends Element<HTMLDivElement, Props> {
  public _content: Div
  public frame: Frame

  private _drawer: Div

  private _knob: IconButton
  private _column: Div

  private _active: boolean = false
  private _hover: boolean = false
  private _y: number = 0

  constructor($props: Props) {
    super($props)

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

    this._y = 0

    const { backgroundColor = 'inherit' } = style

    const knob = new IconButton({
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
      },
      title,
    })
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

    const frame = new Frame({
      className: 'drawer-frame',
      style: {
        position: 'absolute',
        width: `${width + 2}px`,
        height: `${height + 2}px`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: NONE,
        borderRadius: '1px',
        boxSizing: 'border-box',
        // borderRight: '0',
        overflow: 'hidden',
      },
    })
    this.frame = frame

    const content = new Div({
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
    })
    content.registerParentRoot(frame)
    this._content = content

    const column = new Div({
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
    })
    this._column = column

    const drawer = new Div({
      className: classnames('drawer', className),
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
    })
    this._drawer = drawer
    drawer.registerParentRoot(knob)
    drawer.registerParentRoot(content)
    drawer.registerParentRoot(column)

    const $element = parentElement()

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
      this._drawer.setProp('className', current)
    } else if (prop === 'style') {
      const style = this._drawer_style()
      this._drawer.setProp('style', style)
      const { backgroundColor = NONE } = style
      // mergeStyle(this._knob, { backgroundColor })
      this._knob.$slot['default'].$element.style.backgroundColor =
        backgroundColor
    } else if (prop === 'active') {
      this._setActive(current)
    } else if (prop === 'y') {
      this._y = current
      // mergeStyle(this._drawer, {
      //   top: `${this._y}px`,
      // })
      this._drawer.$element.style.top = `${this._y}px`
    } else if (prop === 'width') {
      this._resize()
    } else if (prop === 'height') {
      this._resize()
    } else if (prop === 'hidden') {
      this._resize()
    }
  }

  private setActive = (active: boolean): void => {
    if (active) {
      this._setActive(true)
      this.dispatchEvent('active', {})
    } else {
      this._setActive(false)
      this.dispatchEvent('inactive', {})
    }
  }

  private _transform = (): string => {
    const { $width } = this.$context
    const { width = 0, style = {}, component, hidden } = this.$props

    let translateX: number

    if (this._active) {
      translateX = -Math.min(
        component ? width + 2 + 6 - 1 : 0,
        $width - KNOB_HEIGHT
      )
    } else {
      translateX = 0
    }

    if (hidden) {
      translateX = -translateX + 34
    }

    return `translateX(${translateX}px)`
  }

  private _setActive = (active: boolean) => {
    this._active = active
    this._knob.setProp('active', active)
    this._resize()
  }

  private _resize = (): void => {
    // console.log('Drawer', '_resize')

    const { $width, $height } = this.$context
    const { width = 0, height = KNOB_HEIGHT, component } = this.$props

    const transform = this._transform()

    // mergeStyle(this._drawer, {
    //   transform,
    // })
    this._drawer.$element.style.transform = transform

    if (width > $width - KNOB_HEIGHT) {
      // mergeStyle(this._frame, {
      //   width: `${$width - KNOB_HEIGHT - 8}px`,
      //   height: `${height + 2}px`,
      // })
      this.frame.$element.style.width = `${$width - KNOB_HEIGHT - 8}px`
      this.frame.$element.style.height = `${height + 2}px`

      // mergeStyle(this._content, {
      //   width: component ? `${$width - KNOB_HEIGHT}px` : '0',
      //   height: `${height + 6}px`,
      // })
      this._content.$element.style.width = component
        ? `${$width - KNOB_HEIGHT}px`
        : '0'
      this._content.$element.style.height = `${height + 6}px`
    } else {
      // mergeStyle(this._frame, {
      //   width: `${width + 2}px`,
      //   height: `${height + 2}px`,
      // })
      this.frame.$element.style.width = `${width + 2}px`
      this.frame.$element.style.height = `${height + 2}px`

      // mergeStyle(this._content, {
      //   width: component ? `${width + 2 + 6}px` : '0',
      //   height: `${height + 2 + 6}px`,
      // })
      ;(this._content.$element.style.width = component
        ? `${width + 2 + 6}px`
        : '0'),
        (this._content.$element.style.height = `${height + 2 + 6}px`)
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
            // mergeStyle(this._drawer, {
            //   top: `${this._y}px`,
            // })
            this._drawer.$element.style.top = `${this._y}px`
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
}
