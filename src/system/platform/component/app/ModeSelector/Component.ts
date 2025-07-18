import { addListeners } from '../../../../../client/addListener'
import { classnames } from '../../../../../client/classnames'
import { mergePropStyle } from '../../../../../client/component/mergeStyle'
import { Context } from '../../../../../client/context'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeClickListener } from '../../../../../client/event/pointer/click'
import { Mode, MODE_LIST } from '../../../../../client/mode'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE, getThemeModeColor } from '../../../../../client/theme'
import { userSelect } from '../../../../../client/util/style/userSelect'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import Div from '../../Div/Component'
import SVGRect from '../../svg/Rect/Component'
import ModeIconButton from '../ModeIconButton/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  mode?: Mode
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  width: 'auto',
  height: '195px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '6px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderLeft: 'none',
  borderTopRightRadius: '3px',
  borderBottomRightRadius: '3px',
  boxSizing: 'content-box',
}

const CRUD_MARGIN = 4
const NON_CRUD_MARGIN = 12
const ICON_WIDTH = 21

const MODE_TOP: Dict<number> = {
  none: 0,
  info: 6,
  change: 6 + 1 * ICON_WIDTH + NON_CRUD_MARGIN + CRUD_MARGIN,
  remove: 6 + 2 * ICON_WIDTH + 1 * NON_CRUD_MARGIN + 4 * CRUD_MARGIN,
  add: 6 + 3 * ICON_WIDTH + 1 * NON_CRUD_MARGIN + 7 * CRUD_MARGIN,
  data: 6 + 4 * ICON_WIDTH + 1 * NON_CRUD_MARGIN + 10 * CRUD_MARGIN,
  multiselect: 6 + 5 * ICON_WIDTH + 2 * NON_CRUD_MARGIN + 11 * CRUD_MARGIN + 1,
}

const MODE_ICON = {
  info: 'description',
  change: 'exchange',
  remove: 'x',
  add: 'plus-2',
  data: 'data',
  multiselect: 'brackets',
}

const MODE_SHORTCUT = {
  info: 'q',
  change: 'f',
  remove: 'd',
  add: 's',
  data: 'a',
  multiselect: 'Shift',
}

export default class Modes extends Element<HTMLDivElement, Props> {
  public _modes: Div

  private _mode_button_container: Dict<Div> = {}
  private _mode_button: Dict<ModeIconButton> = {}

  private _selector: Div

  private _mode: Mode = 'none'

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {} } = this.$props

    const { color = 'currentColor' } = style

    const selector = new Div(
      {
        style: {
          position: 'absolute',
          width: '25px',
          height: '25px',
          left: '4px',
          top: '4px',
          borderRadius: '1px',
          boxSizing: 'borderBox',
          pointerEvents: 'none',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLOR_NONE,
          ...userSelect('none'),
        },
      },
      this.$system
    )
    this._selector = selector

    this._mode_button = {}

    for (const mode of MODE_LIST) {
      const activeColor = 'currentColor'

      const icon = MODE_ICON[mode]
      const shortcut = MODE_SHORTCUT[mode]

      const mode_button_container = new Div(
        {
          style: {
            position: 'relative',
            width: '21px',
            height: '21px',
          },
        },
        this.$system
      )

      const MODE_BUTTON_WIDTH = 33 + 24
      const MODE_BUTTON_HEIGHT = 33

      const mode_button_touch_area = new SVGRect(
        {
          style: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: `${MODE_BUTTON_WIDTH}px`,
            height: `${MODE_BUTTON_HEIGHT}px`,
            transform: 'translate(-6px, -6px)',
            stroke: 'transparent',
            zIndex: '-1',
            fill: 'transparent',
            cursor: 'pointer',
          },
        },
        this.$system
      )

      const mode_button = new ModeIconButton(
        {
          icon,
          style: {
            position: 'relative',
            overflow: 'visible',
            color,
          },
          title: mode,
          activeColor,
          shortcut,
        },
        this.$system
      )

      mode_button.appendChild(mode_button_touch_area)

      mode_button_container.addEventListener(
        makeClickListener({
          onClick: () => {
            this._toggle_mode(mode)
          },
        })
      )
      mode_button_container.appendChild(mode_button)

      this._mode_button[mode] = mode_button
      this._mode_button_container[mode] = mode_button_container
    }

    const crud = new Div(
      {
        className: classnames('mode-crud', className),
        style: {
          width: '21px',
          height: '128px',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '4px',
          paddingBottom: '4px',
          gap: '12px',
          zIndex: '-1',
          ...userSelect('none'),
        },
      },
      this.$system
    )
    crud.registerParentRoot(this._mode_button_container['change'])
    crud.registerParentRoot(this._mode_button_container['remove'])
    crud.registerParentRoot(this._mode_button_container['add'])
    crud.registerParentRoot(this._mode_button_container['data'])

    const list = new Div(
      {
        // className: classnames('modes-list', className),
        className: classnames('modes-list'),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system
    )
    this._modes = list
    list.registerParentRoot(selector)
    list.registerParentRoot(this._mode_button_container['info'])
    list.registerParentRoot(crud)
    list.registerParentRoot(this._mode_button_container['multiselect'])

    const $element = parentElement($system)

    this.$element = $element
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      list,
      crud,
      selector,
      info: this._mode_button['info'],
      change: this._mode_button['change'],
      remove: this._mode_button['remove'],
      add: this._mode_button['add'],
      data: this._mode_button['data'],
      multiselect: this._mode_button['multiselect'],
    })

    this.registerRoot(list)
  }

  private _mode_active_color = (mode: Mode): string => {
    const { $theme } = this.$context
    const { style = {} } = this.$props

    const { color = 'currentColor' } = style

    const active_color = getThemeModeColor($theme, mode, color)

    return active_color
  }

  private _toggle_mode = (mode: Mode): void => {
    if (this._mode === mode) {
      if (this._mode !== 'none') {
        this._enter_mode('none')
      }
    } else {
      this._enter_mode(mode)
    }
  }

  public show_tooltips = () => {
    for (const mode of MODE_LIST) {
      const mode_button = this._mode_button[mode]

      mode_button.showTooltip()
    }
  }

  public hide_tooltips = () => {
    for (const mode of MODE_LIST) {
      const mode_button = this._mode_button[mode]

      mode_button.hideTooltip()
    }
  }

  private _enter_mode = (mode: Mode) => {
    const { disabled } = this.$props

    if (disabled) {
      return
    }

    if (this._mode !== mode) {
      const prev_mode = this._mode

      if (prev_mode !== 'none') {
        const prev_button = this._mode_button[prev_mode]
        prev_button.setProp('active', false)
      }

      this._mode = mode

      if (mode !== 'none') {
        const current_button = this._mode_button[mode]
        current_button.setProp('active', true)
      }
    }

    this.dispatchEvent('entermode', { mode })

    if (mode === 'none') {
      mergePropStyle(this._selector, {
        borderColor: COLOR_NONE,
      })
    } else {
      const mode_top = MODE_TOP[mode]
      mergePropStyle(this._selector, {
        top: `${mode_top - 2}px`,
        borderColor: this._mode_active_color(mode),
      })
    }
  }

  private _reset_color = (): void => {
    // console.log('ModeSelector', '_reset_color')

    if (this.$context) {
      const { $theme } = this.$context
      const { style = {} } = this.$props

      const { color = 'currentColor' } = style

      for (const mode of MODE_LIST) {
        const mode_button = this._mode_button[mode]
        const mode_color = getThemeModeColor($theme, mode, color)

        mergePropStyle(mode_button, {
          color,
        })

        mode_button.setProp('hoverColor', mode_color)
        mode_button.setProp('activeColor', mode_color)
      }
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._modes.setProp('style', { ...DEFAULT_STYLE, ...current })

      this._reset_color()
    } else if (prop === 'mode') {
      this._enter_mode(current)
    } else if (prop === 'disabled') {
    }
  }

  public getMode(): Mode {
    return this._mode
  }

  private _context_unlisten: Unlisten

  onMount(): void {
    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', this._reset_color),
    ])
  }

  onUnmount($context: Context): void {
    this._context_unlisten()
  }
}
