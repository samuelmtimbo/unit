import { addListeners } from '../../../../client/addListener'
import applyStyle from '../../../../client/applyStyle'
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
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'

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

  private _context_unlisten: Unlisten

  private _sub_context_unlisten: Unlisten

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style = {}, color, tabIndex, theme, disabled } = $props

    const $element = this.$system.api.document.createElement('div')

    applyStyle($element, { ...DEFAULT_STYLE, ...style })

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

    this.$$context = renderFrame(this.$system, null, $element, $$init)
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

  mountDescendent(child: Component): void {
    // console.log('Frame', 'mountDescendent', child)

    child.mount(this.$$context)
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

    this._sub_context_unlisten = addListeners(this.$$context, [
      makeCustomListener('themechanged', this._on_sub_context_theme_changed),
      makeCustomListener('colorchanged', this._on_sub_context_color_changed),
    ])

    this._refresh_sub_context_disabled()

    this._refresh_sub_context_color()
    // this._refresh_sub_context_theme()
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
    if (this._manually_changed_color) {
      return
    }
    // console.log('Frame', '_refresh_sub_context_color', color)
    const color = this._get_color()

    this._prevent_manual_change_color = true

    setColor(this.$$context, color)

    this._prevent_manual_change_color = false
  }

  private _on_context_color_changed = (): void => {
    if (this._manually_changed_color) {
      return
    }
    // console.log('Frame', 'colorchanged')
    this._refresh_sub_context_color()
  }

  private _on_context_theme_changed = (): void => {
    // console.log('Frame', '_on_context_theme_changed')
    if (this._manually_changed_theme) {
      return
    }

    const { $theme } = this.$context

    this._prevent_manual_change_theme = true

    setTheme(this.$$context, $theme)

    this._prevent_manual_change_theme = false
  }

  private _on_context_enabled = (): void => {
    // console.log('Frame', '_on_context_enabled')
    this._refresh_sub_context_disabled()
  }

  private _on_context_disabled = (): void => {
    // console.log('Frame', '_on_context_disabled')
    this._refresh_sub_context_disabled()
  }

  private _prevent_manual_change_color: boolean = false
  private _prevent_manual_change_theme: boolean = false

  private _manually_changed_color: boolean = false
  private _manually_changed_theme: boolean = false

  private _on_sub_context_theme_changed = (): void => {
    if (this._prevent_manual_change_theme) {
      this._prevent_manual_change_theme = false
      return
    }

    this._manually_changed_theme = true
  }

  private _on_sub_context_color_changed = (): void => {
    if (this._prevent_manual_change_color) {
      this._prevent_manual_change_color = false
      return
    }

    this._manually_changed_color = true
  }

  onUnmount() {
    // console.log('Frame', 'onUnmount')
    setParent(this.$$context, null)

    unmount(this.$$context)

    this._context_unlisten()

    this._sub_context_unlisten()
  }
}
