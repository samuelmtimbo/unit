import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: boolean
  disabled?: boolean
}

export default class Checkbox extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'checked',
      defaultValue: false,
      defaultStyle: $system.style['checkbox'],
      defaultAttr: {
        type: 'checkbox',
      },
    })
  }
}
