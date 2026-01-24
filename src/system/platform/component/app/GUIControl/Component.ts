import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_T_S } from '../../../../../client/animation/ANIMATION_T_S'
import {
  ANIMATION_T_MS,
  linearTransition,
} from '../../../../../client/animation/animation'
import { setAlpha } from '../../../../../client/color'
import { Component } from '../../../../../client/component'
import { mergePropStyle } from '../../../../../client/component/mergeStyle'
import { dragOverTimeListener } from '../../../../../client/dragOverTimeListener'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { makeResizeListener } from '../../../../../client/event/resize'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE, themeBackgroundColor } from '../../../../../client/theme'
import { userSelect } from '../../../../../client/util/style/userSelect'
import {
  DIM_OPACITY,
  whenInteracted,
} from '../../../../../client/whenInteracted'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { rangeArray } from '../../../../../util/array'
import { callAll } from '../../../../../util/call/callAll'
import clamp from '../../../../core/relation/Clamp/f'
import Div from '../../Div/Component'
import Icon from '../../Icon/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  icon?: string
  width?: number
  height?: number
  x?: number
  y?: number
  _x?: number
  _y?: number
  collapsed?: boolean
}

export const DEFAULT_STYLE = {}

export const COLLAPSED_WIDTH = 33
export const COLLAPSED_HEIGHT = 33

export const PADDING = 9

export const BUTTON_HEIGHT = 48
export const BUTTON_WIDTH = 24

export default class GUIControl extends Component<HTMLDivElement, Props> {
  private _root: Div

  private _collapsed_x: number
  private _collapsed_y: number

  private _non_collapsed_x: number
  private _non_collapsed_y: number

  private _x: number
  private _y: number

  private _collapsed: boolean

  private _docked: boolean
  private _docked_x: boolean
  private _docked_y: boolean
  private _docking: boolean

  private _last_dx: number
  private _last_dy: number

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { icon, width = 100, height = 100, style = {} } = this.$props

    let { x = 0, y = 0, collapsed = true, _x = 0, _y = 0 } = this.$props

    this._x = x
    this._y = y

    this._collapsed = collapsed

    this._collapsed_x = this._x
    this._collapsed_y = this._y

    this._non_collapsed_x = this._x + COLLAPSED_WIDTH + 12 + _x
    this._non_collapsed_y = this._y + _y

    const WR = COLLAPSED_WIDTH / width
    const HR = COLLAPSED_HEIGHT / height

    const root = new Div(
      {
        className: 'gui-control',
        style: {
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: this._collapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`,
          height: this._collapsed ? `${COLLAPSED_HEIGHT}px` : `${height}px`,
          borderRadius: '3px',
          // borderRadius: this._collapsed ? '50%' : '3px',
          boxSizing: 'content-box',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this._collapsed ? 'currentColor' : COLOR_NONE,
          transition: `opacity ${ANIMATION_T_S}s linear`,
          zIndex: `${this._z_index}`,
          opacity: this._collapsed ? `${DIM_OPACITY}` : '0',
          touchAction: 'none',
          // contain: 'size layout style paint',
          ...style,
        },
      },
      this.$system
    )

    const collapse = () => {
      const {
        api: {
          window: { setTimeout },
        },
      } = this.$system

      if (_control_in_count === 0) {
        this._collapsed = true

        unlisten_pointer()
        unlisten_pointer = listen_pointer(root)

        this._x = this._collapsed_x || this._x + (width - COLLAPSED_WIDTH) / 2
        this._y = this._collapsed_y || this._y + height - COLLAPSED_HEIGHT

        this._clamp_x_y()

        const backgroundColor = this._background_color()

        mergePropStyle(root, {
          left: `${this._x}px`,
          top: `${this._y}px`,
          width: `${COLLAPSED_WIDTH}px`,
          height: `${COLLAPSED_HEIGHT}px`,
          borderColor: 'currentColor',
          backgroundColor,
          transition: linearTransition(
            'left',
            'top',
            'width',
            'height',
            'border-color',
            'border-radius',
            'background-color'
          ),
        })

        setTimeout(() => {
          mergePropStyle(root, {
            transition: `opacity ${ANIMATION_T_S}s linear`,
          })
        }, ANIMATION_T_MS)

        mergePropStyle(container, {
          opacity: '0',
          transform: `scale(${WR}, ${HR})`,
          pointerEvents: 'none',
          ...userSelect('none'),
        })

        mergePropStyle(icon_, {
          opacity: '1',
          pointerEvents: 'auto',
        })

        mergePropStyle(button, {
          opacity: '0',
          pointerEvents: 'none',
        })

        reset_dim()

        if (this._docked) {
          this.dispatchEvent('dock-move', {
            dy: 0,
            dx: 0,
          })

          this.dispatchEvent('dock-leave', {})
        }
      }

      this.dispatchEvent('collapse')
    }

    const uncollapse = () => {
      const {
        api: {
          window: { setTimeout },
        },
      } = this.$system

      const { width, height } = this.$props

      this._collapsed = false

      this._x = this._non_collapsed_x || (this._x - width + COLLAPSED_WIDTH) / 2
      this._y = this._non_collapsed_y || this._y - height + COLLAPSED_HEIGHT

      this._clamp_x_y()

      mergePropStyle(root, {
        left: `${this._x}px`,
        top: `${this._y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: COLOR_NONE,
        backgroundColor: COLOR_NONE,
        transition: linearTransition(
          'left',
          'top',
          'width',
          'height',
          'border-color',
          'border-radius',
          'background-color'
        ),
      })

      mergePropStyle(container, {
        opacity: '1',
        transform: 'scale(1, 1)',
        pointerEvents: 'auto',
        ...userSelect('auto'),
      })

      mergePropStyle(button, {
        opacity: '1',
        pointerEvents: 'auto',
      })

      setTimeout(() => {
        mergePropStyle(root, {
          transition: `opacity ${ANIMATION_T_S}s linear`,
        })

        mergePropStyle(icon_, {
          pointerEvents: 'none',
        })
      }, ANIMATION_T_MS)

      mergePropStyle(icon_, {
        opacity: '0',
      })

      undim()

      this.dispatchEvent('uncollapse')

      unlisten_pointer()
      unlisten_pointer = listen_pointer(button)

      if (this._docked) {
        const height = this._get_height()
        const width = this._get_width()

        this.dispatchEvent('dock-move', {
          dx: this._docked_x ? width + BUTTON_WIDTH + PADDING + 3 : 0,
          dy: this._docked_y ? height + 3 + 2 : 0,
        })
      }
    }

    const toggle_collapse = (): void => {
      if (this._collapsed) {
        uncollapse()
      } else {
        collapse()
      }
    }

    this._docked = false
    this._docked_x = false
    this._docked_y = false
    this._docking = false

    this._last_dy = 0
    this._last_dx = 0

    let unlisten_pointer: Unlisten

    let release

    const listen_pointer = (component: Component): Unlisten => {
      // console.log('listen_pointer', component, release)

      return callAll([
        component.addEventListeners([
          makeClickListener({
            onClick: () => {
              toggle_collapse()
            },
          }),
          makePointerDownListener(({ pointerId, clientX, clientY }) => {
            component.setPointerCapture(pointerId)

            let hx = clientX - this._x
            let hy = clientY - this._y

            release = () => {
              component.releasePointerCapture(pointerId)

              unlisten()

              release = undefined
            }

            let unlisten = component.addEventListeners([
              makePointerMoveListener(({ clientX, clientY }) => {
                this._x = clientX - hx
                this._y = clientY - hy

                if (this._collapsed) {
                  this._collapsed_x = this._x
                  this._collapsed_y = this._y
                } else {
                  this._non_collapsed_x = this._x
                  this._non_collapsed_y = this._y
                }

                this._clamp_x_y()

                mergePropStyle(root, {
                  left: `${this._x}px`,
                  top: `${this._y}px`,
                })

                if (!this._collapsed) {
                  this._refresh_dock()
                }
              }),
              makePointerUpListener(() => {
                release()
              }),
              makePointerCancelListener(() => {
                release()
              }),
              makePointerLeaveListener(() => {
                release()
              }),
            ])
          }),
        ]),
        dragOverTimeListener(component, 500, () => {
          toggle_collapse()
        }),
        () => {
          if (release) {
            release()
          }
        },
      ])
    }

    const dim = () => {
      mergePropStyle(root, {
        opacity: `${DIM_OPACITY}`,
      })
    }

    const undim = () => {
      mergePropStyle(root, {
        opacity: '1',
      })
    }

    const reset_dim = () => {
      if (this._collapsed) {
        const on_active = (): void => {
          this._set_z_index(MAX_Z_INDEX)

          if (!this._collapsed) {
            return
          }

          undim()
        }

        const on_inactive = (): void => {
          if (!this._collapsed) {
            return
          }

          dim()
        }

        const unlisten_interacted = whenInteracted(
          root,
          3000,
          false,
          on_active,
          on_inactive
        )
      }
    }
    this._root = root

    reset_dim()

    const container = new Div(
      {
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          transform: `${
            this._collapsed ? `scale(${WR}, ${HR})` : 'scale(1, 1)'
          }`,
          transformOrigin: 'top left',
          borderWidth: '0px',
          borderStyle: 'solid',
          borderColor: COLOR_NONE,
          width: `${width}px`,
          height: `${height}px`,
          opacity: this._collapsed ? '0' : '1',
          transition: `transform ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system
    )

    let _control_in_count = 0

    container.addEventListeners([
      makeCustomListener('_control_in', () => {
        _control_in_count++
      }),
      makeCustomListener('_control_out', () => {
        _control_in_count--
      }),
    ])

    const icon_ = new Icon(
      {
        className: 'control-icon',
        icon,
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '3px',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
          opacity: this._collapsed ? '1' : '0',
          transition: `opacity ${ANIMATION_T_S}s linear`,
          cursor: 'pointer',
          pointerEvents: this._collapsed ? 'auto' : 'none',
        },
      },
      this.$system
    )
    icon_.preventDefault('mousedown')
    icon_.preventDefault('touchdown')
    icon_.addEventListener(
      makeClickListener({
        onClick: uncollapse,
      })
    )
    icon_.$element.setAttribute('dropTarget', 'true')

    const button = new Div(
      {
        className: 'gui-control-knob',
        style: {
          position: 'absolute',
          left: `-${BUTTON_WIDTH}px`,
          opacity: this._collapsed ? '0' : '1',
          height: `${BUTTON_HEIGHT}px`,
          top: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLOR_NONE,
          width: `${BUTTON_WIDTH}px`,
          cursor: 'pointer',
          willChange: 'opacity',
          transition: linearTransition('opacity'),
          transform: 'translateY(-50%)',
          pointerEvents: this._collapsed ? 'none' : 'auto',
          touchAction: 'none',
          ...userSelect('none'),
        },
      },
      this.$system
    )
    button.preventDefault('mousedown')
    button.preventDefault('touchdown')
    button.preventDefault('touchstart')
    button.$element.setAttribute('dropTarget', 'true')

    const button_inner = new Div(
      {
        style: {
          width: '8px',
          height: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      this.$system
    )

    button.appendChild(button_inner)

    rangeArray(6).forEach((i) => {
      const grip_circle = new Div(
        {
          style: {
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          },
        },
        this.$system
      )

      button_inner.appendChild(grip_circle)
    })

    if (this._collapsed) {
      unlisten_pointer = listen_pointer(root)
    } else {
      unlisten_pointer = listen_pointer(button)
    }

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = container.$slot
    this.$primitive = true
    this.$unbundled = false

    this.setSubComponents({
      root,
      container,
      button,
      icon: icon_,
    })

    container.registerParentRoot(button)

    root.registerParentRoot(container)
    root.registerParentRoot(icon_)

    this.registerRoot(root)
  }
  private _get_screen_ratio() {
    const { $width, $height } = this.$context

    return $width / $height
  }

  private _refresh_dock = () => {
    const { $width, $height } = this.$context

    const screen_ratio = this._get_screen_ratio()

    if (screen_ratio < 1) {
      const height = this._get_height()

      const dy = this._y + height - $height + 3

      if (dy >= 0) {
        if (this._last_dy > dy) {
          this._docking = false
        } else {
          this._docking = true
        }

        if (this._docked && dy > 3) {
          this._docked = false

          if (this._docking) {
            //
          } else {
            this.dispatchEvent('dock-move', {
              dy,
            })
          }
        } else {
          this._docked = true
          this._docked_y = true

          if (this._docking) {
            this.dispatchEvent('dock-move', {
              dy: height + 3 + 2,
            })
          } else {
            //
          }
        }

        this._last_dy = dy
      } else {
        if (this._docked) {
          this._docked = false
          this._docked_y = false

          this.dispatchEvent('dock-move', {
            dy: 0,
          })

          this.dispatchEvent('dock-leave', {})
        }
      }
    } else {
      const width = this._get_width()

      const dx = this._x - (BUTTON_WIDTH + PADDING)

      if (dx <= 3) {
        if (this._last_dx < dx) {
          this._docking = false
        } else {
          this._docking = true
        }

        const dxb = dx

        if (this._docked && dxb > 2) {
          this._docked = false

          if (this._docking) {
            //
          } else {
            this.dispatchEvent('dock-move', {
              dx,
            })
          }
        } else {
          this._docked = true
          this._docked_x = true

          if (this._docking) {
            this.dispatchEvent('dock-move', {
              dx: width + BUTTON_WIDTH + PADDING + 3,
            })
          } else {
            //
          }
        }

        this._last_dx = dx
      } else {
        if (this._docked) {
          this._docked = false
          this._docked_x = false

          this.dispatchEvent('dock-move', {
            dx: 0,
          })

          this.dispatchEvent('dock-leave', {})
        }
      }
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      const { width, height } = this.$props

      this._root.setProp('style', {
        position: 'absolute',
        left: `${this._x}px`,
        top: `${this._y}px`,
        width: this._collapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`,
        height: this._collapsed ? `${COLLAPSED_HEIGHT}px` : `${height}px`,
        borderRadius: '3px',
        // borderRadius: this._collapsed ? '50%' : '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: this._collapsed ? 'currentColor' : COLOR_NONE,
        transition: `opacity ${ANIMATION_T_S}s linear`,
        zIndex: `${this._z_index}`,
        opacity: this._collapsed ? `${DIM_OPACITY}` : '0',
        touchAction: 'none',
        // contain: 'size layout style paint',
        ...current,
      })
    }
  }

  private _background_color = (): string => {
    const { $theme } = this.$context

    const backgroundColor = setAlpha(themeBackgroundColor($theme), 0.75)

    return backgroundColor
  }

  private _refresh_color = (): void => {
    if (this._collapsed) {
      const backgroundColor = this._background_color()

      mergePropStyle(this._root, {
        backgroundColor,
      })
    } else {
      mergePropStyle(this._root, {
        backgroundColor: COLOR_NONE,
      })
    }
  }

  private _set_z_index = (zIndex: number) => {
    this._z_index = zIndex

    mergePropStyle(this._root, {
      zIndex: `${zIndex}`,
    })
  }

  private _context_unlisten: Unlisten

  private _z_index: number = MAX_Z_INDEX

  private _clamp_x_y = () => {
    const { $width, $height } = this.$context

    const w = this._get_width()
    const h = this._get_height()

    this._x = clamp({
      a: this._x,
      min: this._collapsed ? PADDING : BUTTON_WIDTH + PADDING,
      max: $width - w - PADDING - 1,
    }).a
    this._y = clamp({
      a: this._y,
      min: PADDING + 1,
      max: this._collapsed ? $height - BUTTON_HEIGHT + 4 : $height - h,
    }).a
  }

  private _get_height() {
    const { height } = this.$props

    return this._collapsed ? COLLAPSED_HEIGHT : height
  }

  private _get_width() {
    const { width } = this.$props

    return this._collapsed ? COLLAPSED_WIDTH : width
  }

  onMount(): void {
    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', () => {
        this._refresh_color()
      }),
      makeResizeListener(() => {
        this._clamp_x_y()

        mergePropStyle(this._root, {
          left: `${this._x}px`,
          top: `${this._y}px`,
        })

        this._refresh_dock()
      }),
    ])

    this._refresh_color()
  }

  onUnmount(): void {
    this._context_unlisten()
  }
}
