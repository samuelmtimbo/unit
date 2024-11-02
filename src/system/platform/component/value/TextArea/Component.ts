import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  placeholder?: string
  maxLength?: number
  attr?: Dict<any>
}

export default class TextArea extends Field<HTMLTextAreaElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('textarea'), {
      valueKey: 'value',
      defaultStyle: $system.style['textarea'],
    })

    const {
      flags: { defaultInputModeNone },
    } = $system

    const { placeholder = '', maxLength = undefined } = $props

    this.$element.spellcheck = false
    this.$element.autocomplete = 'off'
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'text'

    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }

    this.$element.placeholder = placeholder

    if (maxLength !== undefined) {
      this.$element.maxLength = maxLength
    }
  }
}
