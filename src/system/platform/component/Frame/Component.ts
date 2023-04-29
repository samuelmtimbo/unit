import { addListeners } from '../../../../client/addListener'
import { Component } from '../../../../client/component'
import {
  Context,
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
import { applyDynamicStyle } from '../../../../client/style'
import { Theme } from '../../../../client/theme'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'

export interface Props {
  className?: string
  style?: Dict<any>
  disabled?: boolean
  color?: string
  theme?: Theme
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  top: '0',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  zIndex: '0',
}

export default class Frame extends Element<HTMLDivElement, Props> {
  public $$context: Context

  private _context_unlisten: Unlisten

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style = {}, color, tabIndex, theme, disabled } = $props

    const $element = this.$system.api.document.createElement('div')

    $element.classList.add('frame')

    if (className !== undefined) {
      $element.classList.add(className)
    }

    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }

    this.$element = $element

    const $$init: Partial<Context> = {
      $disabled: true,
    }

    if (color !== undefined) {
      $$init.$color = color
    }

    applyDynamicStyle(this, { ...DEFAULT_STYLE, ...style })

    this.$$context = renderFrame(this.$system, null, $element, $$init)
  }

  private _prop_handler = {
    style: (style: Dict<string> = {}) => {
      applyDynamicStyle(this, { ...DEFAULT_STYLE, ...style })

      this._refresh_sub_context_color()
    },
    disabled: (disabled: boolean) => {
      this._refresh_sub_context_disabled()
    },
    theme: (theme: Theme) => {
      this._refresh_sub_context_color()
    },
    color: (color: string) => {
      this._refresh_sub_context_color()
    },
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  mountChild(child: Component, commit: boolean = true): void {
    // console.log('Frame', 'mountDescendent', child, commit)

    child.mount(this.$$context, commit)
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
    this._refresh_sub_context_theme()
  }
  private _refresh_sub_context_theme() {
    const { $theme } = this.$context

    const { theme } = this.$props

    const _theme = theme ?? $theme ?? 'dark'

    setTheme(this.$$context, _theme)
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
    // console.log('Frame', '_refresh_sub_context_color')
    const color = this._get_color()

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

    this._context_unlisten()

    unmount(this.$$context)
  }
}
