import { isColorName, isHEX, nameToColor } from '../../../../../client/color'
import { Element } from '../../../../../client/element'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import parentElement from '../../../../../client/platform/web/parentElement'
import { applyTheme } from '../../../../../client/theme'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Icon from '../../Icon/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  icon?: string
  title?: string
  hidden?: boolean
  active?: boolean
  disabled?: boolean
  hoverColor?: string
  activeColor?: string
  disabledColor?: string
}

export const DEFAULT_STYLE = {
  cursor: 'pointer',
  color: 'currentColor',
  touchAction: 'none',
}

export default class IconButton extends Element<HTMLDivElement, Props> {
  private _hovered: boolean = false

  private _icon_comp: Icon

  private _update_color = (): void => {
    // mergeStyle(this._icon_comp, { color: this._current_color() })
    this._icon_comp.$element.style.color = this._current_color()
  }

  private _current_color = (): string => {
    const { $theme } = this.$context

    const { style = {}, active, disabled } = this.$props

    let { color = 'currentColor' } = style

    if (isColorName(color)) {
      color = nameToColor(color)
    }

    const hex = isHEX(color)

    const {
      disabledColor = hex ? applyTheme($theme, color, 75) : 'currentColor',
      hoverColor = hex ? applyTheme($theme, color, -60) : 'currentColor',
      activeColor = hex ? applyTheme($theme, color, -90) : 'currentColor',
    } = this.$props

    let current_color: string

    if (disabled) {
      current_color = disabledColor
    } else if (active) {
      current_color = activeColor
    } else if (this._hovered) {
      current_color = hoverColor
    } else {
      current_color = color
    }
    return current_color
  }

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, icon = 'question', title, style = {} } = this.$props

    const icon_comp = new Icon(
      {
        className,
        icon,
        title,
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    icon_comp.addEventListener(makePointerEnterListener(this._on_pointer_enter))
    icon_comp.addEventListener(makePointerLeaveListener(this._on_pointer_leave))

    this._icon_comp = icon_comp

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = { default: icon_comp }
    this.$subComponent = {
      icon_comp,
    }
    this.$unbundled = false

    this.registerRoot(icon_comp)
  }

  onPropChanged(prop: string, current: any) {
    // console.log('IconButton', 'onPropChanged')
    if (prop === 'icon') {
      this._icon_comp.setProp('icon', current)
    } else if (prop === 'style') {
      this._icon_comp.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
        color: this._current_color(),
      })
    } else if (
      prop === 'active' ||
      prop === 'disabled' ||
      prop === 'activeColor' ||
      prop === 'disabledColor'
    ) {
      this._update_color()
    }
  }

  private _on_pointer_enter = () => {
    // console.log('IconButton', '_on_pointer_enter')
    this._hovered = true
    this._update_color()
  }

  private _on_pointer_leave = () => {
    // console.log('IconButton', '_on_pointer_leave')
    this._hovered = false
    this._update_color()
  }
}
