import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  attr?: Dict<any>
  value?: string
}

export default class PasswordField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const defaultStyle = $system.style['passwordfield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultValue: '',
      defaultStyle,
      defaultAttr: {
        type: 'password',
        autocomplete: 'off',
      },
    })
  }

  public setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
