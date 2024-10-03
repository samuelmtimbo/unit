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

export const DEFAULT_STYLE = {
  '-webkit-text-security': 'disc',
  height: 'fit-content',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  textAlign: 'center',
  padding: '0',
  fontSize: '18px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
  boxSizing: 'border-box',
}

export default class PasswordField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
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
