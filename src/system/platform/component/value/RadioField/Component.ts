import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Attr, Style } from '../../../Style'

export interface Props {
  className?: string
  attr?: Attr
  style?: Style
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
      emitOnChange: false,
    })
  }
}
