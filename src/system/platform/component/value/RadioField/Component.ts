import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  name?: string
}

export default class RadioField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: $system.style['radiofield'],
      defaultValue: '',
      defaultAttr: {
        type: 'radio',
      },
    })
  }
}
