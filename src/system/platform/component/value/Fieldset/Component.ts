import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
}

export const DEFAULT_STYLE = {
  border: '1px solid currentColor',
}

export default class Fieldset extends Field<HTMLFieldSetElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('fieldset'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })
  }
}
