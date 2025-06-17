import { addListeners } from '../../../../../client/addListener'
import { Component } from '../../../../../client/component'
import { mergePropStyle } from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeResizeListener } from '../../../../../client/event/resize'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import Div from '../../Div/Component'
import _Text from '../../value/Text/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  icon?: string
  title?: string
  shortcut?: string
  component?: Component
  x?: number
  y?: number
}

export const TOOLTIP_WIDTH = 30
export const TOOLTIP_HEIGHT = 30

export const DEFAULT_STYLE = {
  position: 'relative',
  minWidth: `${TOOLTIP_WIDTH}px`,
  width: 'fit-content',
  height: `${TOOLTIP_HEIGHT}px`,
  margin: '0',
  background: '#000000aa',
  borderRadius: '3px',
  border: '2px solid currentcolor',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Tooltip extends Element<HTMLDivElement, Props> {
  public _tooltip: Div

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, icon, style = {}, shortcut } = this.$props

    const tooltip = new Div(
      {
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        attr: {
          popover: 'manual',
        },
      },
      this.$system
    )
    this._tooltip = tooltip

    const tooltipContent = new Div(
      {
        style: {
          display: 'flex',
          width: 'fit-content',
          minWidth: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        },
      },
      this.$system
    )

    const tooltipText = new _Text(
      {
        value: shortcut,
      },
      this.$system
    )

    tooltipContent.registerParentRoot(tooltipText)

    // Firefox hasn't implemented popover yet, so just don't ever display it
    if (!this._tooltip.$element.showPopover) {
      this._tooltip.$element.style.display = 'none'
    }

    tooltip.registerParentRoot(tooltipContent)

    const $element = parentElement($system)

    this.$element = $element
    this.$node = tooltip.$node
    this.$slot = { default: tooltipContent }
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      tooltip,
      tooltipContent,
    })

    this.registerRoot(tooltip)

    this._refresh_background_color()
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._tooltip.setProp('style', { ...DEFAULT_STYLE, ...current })
    }
  }

  public show(): void {
    const { component } = this.$props

    if (component) {
      this._reposition()

      if (this._tooltip.$element.showPopover) {
        this._tooltip.$element.showPopover()
      }
    }
  }

  public hide(): void {
    if (this._tooltip.$element.hidePopover) {
      this._tooltip.$element.hidePopover()
    }
  }

  private _reposition = () => {
    const { component, x = 0, y = 0 } = this.$props

    if (component) {
      const bbox = component.getBoundingClientRect()

      if (this._tooltip.$element.showPopover) {
        const x_ = bbox.x + bbox.width / 2 - TOOLTIP_WIDTH / 2 + x
        const y_ = bbox.y + y - 3

        mergePropStyle(this._tooltip, {
          left: `${x_}px`,
          top: `${y_}px`,
        })
      }
    }
  }

  public hidden(): boolean {
    return !this._tooltip.$element.matches(':popover-open')
  }

  private _context_unlisten: Unlisten

  private _refresh_background_color = () => {
    if (this.$context) {
      const { $theme } = this.$context

      const background = $theme === 'dark' ? '#000000aa' : '#ffffffaa'

      mergePropStyle(this._tooltip, {
        background,
      })
    }
  }

  private _on_context_theme_changed = () => {
    this._refresh_background_color()
  }

  private _on_context_resize = () => {
    if (!this.hidden()) {
      this._reposition()
    }
  }

  onMount(): void {
    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', this._on_context_theme_changed),
      makeResizeListener(this._on_context_resize),
    ])
  }

  onUnmount(): void {
    this._context_unlisten()
  }
}
