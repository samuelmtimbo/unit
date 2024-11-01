import { Field } from '../../../../../client/field'
import { applyDynamicStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  maxLength?: number
  tabIndex?: number
}

export default class EditableField extends Field<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['editablefield']

    super($props, $system, $system.api.document.createElement('div'), {
      valueKey: 'innerText',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    this.$element.contentEditable = 'true'

    const {
      flags: { defaultInputModeNone },
    } = $system

    const { style, maxLength, tabIndex } = $props

    this.$element.spellcheck = false
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'text'

    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }

    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }

    applyDynamicStyle(this, this.$element, { ...DEFAULT_STYLE, ...style })
  }
}
