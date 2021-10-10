import { System } from '../../../../boot'
import { addListeners } from '../../../../client/addListener'
import applyStyle from '../../../../client/applyStyle'
import { Component } from '../../../../client/component'
import {
  attach,
  Context,
  dettach,
  disableContext,
  enableContext,
  mount,
  setColor,
  setParent,
  setTheme,
  unmount,
} from '../../../../client/context'
import { Element } from '../../../../client/element'
import { makeCustomListener } from '../../../../client/event/custom'
import { renderFrame } from '../../../../client/renderFrame'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../Unlisten'

export interface Props {
  className?: string
  style?: Dict<any>
  disabled?: boolean
  color?: string
  theme?: 'dark' | 'light'
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
}

export default class Frame extends Element<HTMLDivElement, Props> {
  public $$context: Context

  constructor($props: Props) {
    super($props)

    const { className, style = {}, color, tabIndex, theme, disabled } = $props

    const $element = document.createElement('div')

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

    if (className !== undefined) {
      $element.classList.add(className)
    }

    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }

    this.$element = $element

    this.$$context = renderFrame(null, $element, {
      $color: color,
      $disabled: true,
    })
  }

  private _prop_handler = {
    style: (style: Dict<string> = {}) => {
      applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })
      this._refresh_sub_context_color()
    },
    disabled: (disabled: boolean) => {
      this._refresh_sub_context_disabled()
    },
    theme: (theme: 'light' | 'dark') => {
      this._refresh_sub_context_color()
    },
    color: (color: string) => {
      this._refresh_sub_context_color()
    },
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  private _context_unlisten: Unlisten

  protected mountDescendent(child: Component): void {
    // console.log('Frame', 'mountDescendent', child)
    child.mount(this.$$context)
  }

  onAttach() {
    // console.log('Frame', 'onAttach')
    attach(this.$$context, this.$system)
  }

  onDettach($system: System) {
    // console.log('Frame', 'onDettach')
    dettach(this.$$context, $system)
  }

  onMount() {
    // console.log('Frame', 'onMount')
    setParent(this.$$context, this.$parent)

    mount(this.$$context)

    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('enabled', this._on_context_enabled),
      makeCustomListener('disabled', this._on_context_disabled),
      makeCustomListener('themechanged', this._on_context_theme_changed),
      makeCustomListener('colorchanged', this._on_context_color_changed),
    ])

    this._refresh_sub_context_disabled()
    this._refresh_sub_context_color()
  }

  private _refresh_sub_context_disabled = () => {
    const { disabled } = this.$props
    if (disabled === undefined) {
      const { $disabled } = this.$context
      if ($disabled) {
        disableContext(this.$$context)
      } else {
        enableContext(this.$$context)
      }
    } else if (disabled) {
      disableContext(this.$$context)
    } else {
      enableContext(this.$$context)
    }
  }

  private _get_color = (): string => {
    const { color: _color, style = {} } = this.$props
    const { color } = style
    if (color) {
      return color
    }
    if (_color) {
      return _color
    }
    if (this.$context) {
      const { $color } = this.$context
      return $color
    }
    return 'currentColor'
  }

  private _refresh_sub_context_color = (): void => {
    const color = this._get_color()
    // console.log('Frame', '_refresh_sub_context_color', color)
    setColor(this.$$context, color)
  }

  private _on_context_color_changed = (): void => {
    // console.log('Frame', 'colorchanged')
    this._refresh_sub_context_color()
  }

  private _on_context_theme_changed = (): void => {
    // console.log('Frame', '_on_context_theme_changed')
    const { $theme } = this.$context
    setTheme(this.$$context, $theme)
  }

  private _on_context_enabled = (): void => {
    // console.log('Frame', '_on_context_enabled')
    this._refresh_sub_context_disabled()
  }

  private _on_context_disabled = (): void => {
    // console.log('Frame', '_on_context_disabled')
    this._refresh_sub_context_disabled()
  }

  onUnmount() {
    // console.log('Frame', 'onUnmount')
    setParent(this.$$context, null)
    unmount(this.$$context)

    this._context_unlisten()
  }
}
