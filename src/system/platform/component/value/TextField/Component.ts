import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  maxLength?: number
  attr?: Dict<any>
}

export default class TextField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: $system.style['textfield'],
      defaultValue: '',
      defaultAttr: {
        type: 'text',
        spellcheck: false,
        autocomplete: 'off',
        autocapitalize: 'off',
        inputmode: $system.flags.defaultInputModeNone ? 'none' : 'text',
      },
      propHandlers: {
        maxLength: (maxLength: number | undefined) => {
          this.$element.maxLength = maxLength
        },
      },
    })

    const { maxLength } = $props

    if (maxLength !== undefined) {
      this.$element.maxLength = maxLength
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
