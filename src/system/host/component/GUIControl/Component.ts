import { addListeners } from '../../../../client/addListener'
import {
  ANIMATION_T_MS,
  linearTransition,
} from '../../../../client/animation/animation'
import { ANIMATION_T_S } from '../../../../client/animation/ANIMATION_T_S'
import { Component } from '../../../../client/component'
import mergeStyle from '../../../../client/component/mergeStyle'
import { makeCustomListener } from '../../../../client/event/custom'
import { makeClickListener } from '../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../client/event/pointer/pointerdown'
import { makePointerMoveListener } from '../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../client/event/pointer/pointerup'
import { makeResizeListener } from '../../../../client/event/resize'
import { MAX_Z_INDEX } from '../../../../client/MAX_Z_INDEX'
import parentElement from '../../../../client/platform/web/parentElement'
import {
  COLOR_NONE,
  setAlpha,
  themeBackgroundColor,
} from '../../../../client/theme'
import { userSelect } from '../../../../client/util/style/userSelect'
import { DIM_OPACITY, whenInteracted } from '../../../../client/whenInteracted'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'
import callAll from '../../../../util/call/callAll'
import { uuid } from '../../../../util/id'
import clamp from '../../../core/relation/Clamp/f'
import Div from '../../../platform/component/Div/Component'
import Icon from '../../../platform/component/Icon/Component'
import { dragOverTimeListener } from '../IconTabs/dragOverTimeListener'

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

export const BUTTON_HEIGHT = 24

export default class GUIControl extends Component<HTMLDivElement, Props> {
  private _root: Div

  private _collapsed_x: number
  private _collapsed_y: number

  private _non_collapsed_x: number
  private _non_collapsed_y: number

  private _x: number
  private _y: number
  private _collapsed: boolean

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { icon, width = 100, height = 100, style = {} } = this.$props

    let { x = 0, y = 0, collapsed = true } = this.$props

    this._x = x
    this._y = y

    this._collapsed = collapsed

    // if (this._collapsed) {
    //   this._collapsed_x = this._x
    //   this._collapsed_y = this._y
    // } else {
    // }

    this._collapsed_x = this._x
    this._collapsed_y = this._y

    this._non_collapsed_x = this._x
    this._non_collapsed_y = this._y

    const WR = COLLAPSED_WIDTH / width
    const HR = COLLAPSED_HEIGHT / height

    const root = new Div(
      {
        className: 'iounappcontrol',
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
      this.$system,
      this.$pod
    )

    const collapse = () => {
      if (_iounapp_control_in_count === 0) {
        this._collapsed = true

        unlisten_pointer()
        unlisten_pointer = listen_pointer(root)

        this._x = this._collapsed_x || this._x + (width - COLLAPSED_WIDTH) / 2
        this._y = this._collapsed_y || this._y + height - COLLAPSED_HEIGHT

        this._clamp_x_y()

        const backgroundColor = this._background_color()
        mergeStyle(root, {
          left: `${this._x}px`,
          top: `${this._y}px`,
          width: `${COLLAPSED_WIDTH}px`,
          height: `${COLLAPSED_HEIGHT}px`,
          borderColor: 'currentColor',
          // borderRadius: '50%',
          backgroundColor,
          transition: `left ${ANIMATION_T_S}s linear, top ${ANIMATION_T_S}s linear, width ${ANIMATION_T_S}s linear, height ${ANIMATION_T_S}s linear, border-color ${ANIMATION_T_S}s linear, border-radius ${ANIMATION_T_S}s linear, background-color ${ANIMATION_T_S}s linear`,
        })

        // root.animate(
        //   [
        //     {
        //       top: `${y}px`,
        //       left: `${x}px`,
        //       width: `33px`,
        //       height: `33px`,
        //       borderColor: 'currentColor',
        //     },
        //   ],
        //   {
        //     duration: ANIMATION_T_MS,
        //     fill: 'forwards',
        //   }
        // )

        setTimeout(() => {
          mergeStyle(root, {
            transition: `opacity ${ANIMATION_T_S}s linear`,
          })
        }, ANIMATION_T_MS)

        mergeStyle(container, {
          opacity: '0',
          transform: `scale(${WR}, ${HR})`,
          pointerEvents: 'none',
          ...userSelect('none'),
        })

        mergeStyle(_icon, {
          opacity: '1',
          pointerEvents: 'auto',
        })

        mergeStyle(button, {
          bottom: '-13px',
          pointerEvents: 'none',
        })

        reset_dim()
      } else {
        this.dispatchContextEvent('_iounapp_control_back', false)
      }
    }

    const uncollapse = () => {
      const { width, height } = this.$props

      this._collapsed = false

      unlisten_pointer()
      unlisten_pointer = listen_pointer(button)

      this._x = this._non_collapsed_x || (this._x - width + COLLAPSED_WIDTH) / 2
      this._y = this._non_collapsed_y || this._y - height + COLLAPSED_HEIGHT

      this._clamp_x_y()

      mergeStyle(root, {
        left: `${this._x}px`,
        top: `${this._y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: COLOR_NONE,
        // borderRadius: '3px',
        backgroundColor: COLOR_NONE,
        transition: `opacity ${ANIMATION_T_S}s linear, left ${ANIMATION_T_S}s linear, top ${ANIMATION_T_S}s linear, width ${ANIMATION_T_S}s linear, height ${ANIMATION_T_S}s linear, border-color ${ANIMATION_T_S}s linear, border-radius ${ANIMATION_T_S}s linear, background-color ${ANIMATION_T_S}s linear`,
      })

      // root.animate(
      //   [
      //     {
      //       top: `${y}px`,
      //       left: `${x}px`,
      //       width: `312px`,
      //       height: `210px`,
      //     },
      //   ],
      //   {
      //     duration: ANIMATION_T_MS,
      //     fill: 'forwards',
      //   }
      // )

      mergeStyle(container, {
        opacity: '1',
        transform: 'scale(1, 1)',
        pointerEvents: 'auto',
        ...userSelect('auto'),
      })

      mergeStyle(button, {
        bottom: '-24px',
        pointerEvents: 'auto',
      })

      setTimeout(() => {
        mergeStyle(root, {
          transition: `opacity ${ANIMATION_T_S}s linear`,
        })
      }, ANIMATION_T_MS)

      mergeStyle(_icon, {
        opacity: '0',
        pointerEvents: 'none',
      })

      undim()
    }

    const toggle_collapse = (): void => {
      if (this._collapsed) {
        uncollapse()
      } else {
        collapse()
      }
    }

    let unlisten_pointer: Unlisten

    const listen_pointer = (component: Component): Unlisten => {
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

            const release = () => {
              component.releasePointerCapture(pointerId)

              unlisten()
            }

            const unlisten = component.addEventListeners([
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

                mergeStyle(root, {
                  left: `${this._x}px`,
                  top: `${this._y}px`,
                })
              }),
              makePointerUpListener(() => {
                // alert('up')
                release()
              }),
              makePointerCancelListener(() => {
                // alert('cancel')
                release()
              }),
            ])
          }),
        ]),
        dragOverTimeListener(component, 500, () => {
          toggle_collapse()
        }),
      ])
    }

    const dim = () => {
      mergeStyle(root, {
        opacity: `${DIM_OPACITY}`,
      })
    }

    const undim = () => {
      mergeStyle(root, {
        opacity: '1',
      })
    }

    const reset_dim = () => {
      if (this._collapsed) {
        const on_active = (): void => {
          const message_id = uuid()

          this._message_id[message_id] = true

          this.dispatchContextEvent('_iounapp_control_foreground', {
            message_id,
          })

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
      this.$system,
      this.$pod
    )
    let _iounapp_control_in_count = 0
    container.addEventListeners([
      makeCustomListener('_iounapp_control_in', () => {
        _iounapp_control_in_count++
      }),
      makeCustomListener('_iounapp_control_out', () => {
        _iounapp_control_in_count--
      }),
    ])

    const _icon = new Icon(
      {
        className: 'iounapp-control-icon',
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
      this.$system,
      this.$pod
    )
    _icon.addEventListener(
      makeClickListener({
        onClick: uncollapse,
      })
    )
    _icon.$element.setAttribute('dropTarget', 'true')

    const button = new Div(
      {
        style: {
          position: 'absolute',
          bottom: this._collapsed
            ? `-${BUTTON_HEIGHT / 2 + 1}px`
            : `-${BUTTON_HEIGHT}px`,
          left: '50%',
          height: `${BUTTON_HEIGHT}px`,
          backgroundColor: COLOR_NONE,
          width: '48px',
          cursor: 'pointer',
          willChange: 'bottom',
          transition: linearTransition('bottom'),
          transform: 'translateX(-50%)',
          pointerEvents: this._collapsed ? 'none' : 'auto',
          touchAction: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    button.preventDefault('mousedown')
    button.preventDefault('touchdown')
    button.$element.setAttribute('dropTarget', 'true')

    if (this._collapsed) {
      unlisten_pointer = listen_pointer(root)
    } else {
      unlisten_pointer = listen_pointer(button)
    }

    const button_bar = new Div(
      {
        className: 'iounapp-keyboard-knob',
        style: {
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          backgroundColor: 'currentColor',
          height: '1px',
          width: '18px',
          cursor: 'pointer',
          transform: 'translateX(-50%)',
          ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = container.$slot

    this.$subComponent = {
      root,
      button,
      button_bar,
      icon: _icon,
    }

    this.registerRoot(root)

    root.registerParentRoot(container)

    root.registerParentRoot(button)

    button.registerParentRoot(button_bar)

    root.registerParentRoot(_icon)
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
      mergeStyle(this._root, {
        backgroundColor,
      })
    } else {
      mergeStyle(this._root, {
        backgroundColor: COLOR_NONE,
      })
    }
  }

  private _set_z_index = (zIndex: number) => {
    this._z_index = zIndex
    mergeStyle(this._root, {
      zIndex: `${zIndex}`,
    })
  }

  private _context_unlisten: Unlisten

  private _z_index: number = MAX_Z_INDEX

  private _message_id: Dict<boolean> = {}

  private _clamp_x_y = () => {
    const { width, height } = this.$props
    const { $width, $height } = this.$context

    const w = this._collapsed ? COLLAPSED_WIDTH : width
    const h = this._collapsed ? COLLAPSED_HEIGHT : height

    this._x = clamp({
      a: this._x,
      min: 0,
      max: $width - w - 2,
    }).a
    this._y = clamp({
      a: this._y,
      min: 0,
      max: $height - h - BUTTON_HEIGHT - 2,
    }).a
  }

  onMount(): void {
    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', () => {
        this._refresh_color()
      }),
      makeResizeListener(() => {
        this._clamp_x_y()

        mergeStyle(this._root, {
          left: `${this._x}px`,
          top: `${this._y}px`,
        })
      }),
      makeCustomListener('_iounapp_control_foreground', ({ message_id }) => {
        if (!this._message_id[message_id]) {
          this._set_z_index(this._z_index - 1)
        } else {
          delete this._message_id[message_id]
        }
      }),
    ])

    this._refresh_color()
  }

  onUnmount(): void {
    this._context_unlisten()
  }
}
