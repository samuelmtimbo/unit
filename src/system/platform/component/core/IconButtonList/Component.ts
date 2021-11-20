import classnames from '../../../../../client/classnames'
import { Element } from '../../../../../client/element'
import { makeShortcutListener } from '../../../../../client/event/keyboard'
import { Mode } from '../../../../../client/mode'
import { Dict } from '../../../../../types/Dict'
import Div from '../../Div/Component'
import ModeIconButton, {
  Props as IconButtonListItemProps,
} from '../ModeIconButton/Component'

type IconButtonOpt = {
  icon: string
  id: string
  color: string
}

export interface Props {
  className?: string
  style?: Dict<string>
  buttons?: IconButtonListItemProps[]
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  width: 'fit-content',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  opacity: '0.75',
}

export default class IconButtonList extends Element<HTMLDivElement, Props> {
  private _mode: Mode = 'none'

  private _list: Div

  private _mode_button: Dict<ModeIconButton> = {}

  constructor($props: Props) {
    super($props)

    const { className, style, buttons = [] } = this.$props

    const icon_button_list_children: Element[] = []

    buttons.forEach(({ id, icon, color }: IconButtonOpt) => {
      const icon_button_list_item = new ModeIconButton({
        icon,
        activeColor: color,
      })
      icon_button_list_children.push(icon_button_list_item)
    })

    const list = new Div({
      className: classnames('crud', className),
      style: { ...DEFAULT_STYLE, ...style },
    })
    list.setChildren(icon_button_list_children)
    this._list = list

    this.addEventListener(
      makeShortcutListener([
        {
          combo: 'a',
          strict: false,
          keydown: () => {
            this._enter_id('info')
          },
          keyup: this._leave_mode,
        },
        {
          combo: 's',
          strict: false,
          keydown: () => {
            this._enter_id('add')
          },
          keyup: this._leave_mode,
        },
        {
          combo: 'd',
          strict: false,
          keydown: () => {
            this._enter_id('remove')
          },
          keyup: this._leave_mode,
        },
        {
          combo: 'f',
          strict: false,
          keydown: () => {
            this._enter_id('change')
          },
          keyup: this._leave_mode,
        },
      ])
    )

    this.$element = list.$element
  }

  private _leave_mode = (): void => {
    this._enter_id('none')
  }

  private _enter_id = (mode: Mode) => {
    const { disabled } = this.$props

    if (disabled) {
      return
    }

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

    this.dispatchEvent('enterid', { mode })
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._list.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'mode') {
      this._enter_id(current)
    } else if (prop === 'disabled') {
    }
  }
}
