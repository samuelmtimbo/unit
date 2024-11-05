import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  maxLength?: number
}

export default class Select extends Field<HTMLSelectElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('select'), {
      valueKey: 'value',
      defaultStyle: $system.style['select'],
      defaultValue: '',
    })
  }
}
