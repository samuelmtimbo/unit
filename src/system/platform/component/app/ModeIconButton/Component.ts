import classnames from '../../../../../client/classnames'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import IconButton from '../../../component/app/IconButton/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  icon: string
  title?: string
  activeColor?: string
  hoverColor?: string
  active?: boolean
}

export const DEFAULT_STYLE = {
  width: '21px',
  height: '21px',
}

export default class ModeIconButton extends Element<HTMLDivElement, Props> {
  private _icon_button: IconButton

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { title } = this.$props

    const {
      className,
      icon,
      activeColor,
      hoverColor,
      active,
      style = {},
    } = this.$props

    const icon_button = new IconButton(
      {
        className: classnames('mode-button', className),
        icon,
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        title,
        active,
        activeColor,
        hoverColor: hoverColor || activeColor,
      },
      this.$system,
      this.$pod
    )
    icon_button.preventDefault('mousedown')
    icon_button.preventDefault('touchdown')
    this._icon_button = icon_button

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = { default: icon_button }
    this.$subComponent = {
      icon_button,
    }
    this.$unbundled = false

    this.registerRoot(icon_button)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._icon_button.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'active') {
      this._icon_button.setProp('active', current)
    } else if (prop === 'activeColor') {
      this._icon_button.setProp('activeColor', current)
    } else if (prop === 'hoverColor') {
      this._icon_button.setProp('hoverColor', current)
    }
  }
}
