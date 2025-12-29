import { getActiveElement } from '../../../../client/activeElement'
import { addListeners } from '../../../../client/addListener'
import { Component, defaultFocusLookup } from '../../../../client/component'
import {
  Context,
  mount,
  setColor,
  setParent,
  setTheme,
  unmount,
} from '../../../../client/context'
import { makeCustomListener } from '../../../../client/event/custom'
import HTMLElement_ from '../../../../client/html'
import { isTextField } from '../../../../client/isTextField'
import { renderFrame } from '../../../../client/renderFrame'
import { Theme } from '../../../../client/theme'
import { userSelect } from '../../../../client/util/style/userSelect'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'

export interface Props {
  className?: string
  style?: Dict<any>
  attr?: Dict<any>
  disabled?: boolean
  color?: string
  theme?: Theme
}

export const DEFAULT_STYLE = {
  top: '0',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  ...userSelect('text'),
}

export default class Frame extends HTMLElement_<HTMLDivElement, Props> {
  public $$context: Context

  private _context_unlisten: Unlisten

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('div'),
      DEFAULT_STYLE,
      {},
      {
        theme: (theme: Theme) => {
          this._refresh_sub_context_color()
        },
        color: (color: string) => {
          this._refresh_sub_context_color()
        },
      }
    )

    const { className, color } = $props

    this.$element.classList.add('frame')

    this.$element.addEventListener('keydown', (event: KeyboardEvent) => {
      const {
        api: {
          document: { getSelection, createRange, canSelectShadowDom },
        },
      } = this.$system

      if (event.metaKey && event.key.toLowerCase() === 'a') {
        // Selection doesn't work on Safari (2024) inside
        // shadowRoot; if this can be detected, accept the
        // default browser behavior
        if (!canSelectShadowDom()) {
          return
        }

        const activeElement = getActiveElement(this.$system)

        if (activeElement && isTextField(activeElement as HTMLElement)) {
          return
        }

        event.preventDefault()

        const range = createRange()

        range.selectNodeContents(this.$element)

        const selection = getSelection()

        selection.removeAllRanges()
        selection.addRange(range)

        event.stopPropagation()
      }
    })

    this.$element.addEventListener('focus', () => {
      defaultFocusLookup(this)
    })

    if (className !== undefined) {
      this.$element.classList.add(className)
    }

    const $$init: Partial<Context> = {
      $disabled: true,
    }

    if (color !== undefined) {
      $$init.$color = color
    }

    this.$$context = renderFrame(
      this.$system,
      this.$context,
      this.$element,
      $$init
    )
  }

  mountChild(child: Component, commit: boolean = true): void {
    // console.log('Frame', 'mountDescendent', child, commit)

    child.mount(this.$$context, commit)
  }

  onMount() {
    // console.log('Frame', 'onMount')

    setParent(this.$$context, this.$context)

    mount(this.$$context)

    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', this._on_context_theme_changed),
      makeCustomListener('colorchanged', this._on_context_color_changed),
    ])

    this._refresh_sub_context_color()
    this._refresh_sub_context_theme()
  }
  private _refresh_sub_context_theme() {
    const { $theme } = this.$context

    const { theme } = this.$props

    const _theme = theme ?? $theme ?? 'dark'

    setTheme(this.$$context, _theme)
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

  onUnmount() {
    // console.log('Frame', 'onUnmount')

    this._context_unlisten()

    this._context_unlisten = undefined

    unmount(this.$$context)

    setParent(this.$$context, null)
  }
}
