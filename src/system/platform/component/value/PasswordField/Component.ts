import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  attr?: Dict<any>
  value?: string
  disabled?: boolean
}

export default class PasswordField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['passwordfield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultValue: '',
      defaultStyle: DEFAULT_STYLE,
    })

    this.$element.type = 'password'
    this.$element.autocomplete = 'off'
  }

  public setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
