import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  placeholder?: string
  attr?: Dict<any>
}

export default class TextArea extends Field<HTMLTextAreaElement, Props> {
  constructor($props: Props, $system: System) {
    const {
      flags: { defaultInputModeNone },
    } = $system

    super($props, $system, $system.api.document.createElement('textarea'), {
      valueKey: 'value',
      defaultStyle: $system.style['textarea'],
      defaultAttr: {
        spellcheck: false,
        autocomplete: 'off',
        autocapitalize: 'off',
        inputmode: defaultInputModeNone ? 'none' : 'text',
      },
      propHandlers: {
        placeholder: (placeholder: string | undefined) => {
          this.$element.placeholder = placeholder
        },
      },
    })

    const { placeholder = '' } = $props

    this.$element.placeholder = placeholder
  }
}
