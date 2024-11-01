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
    const DEFAULT_STYLE = $system.style['checkbox']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'checked',
      defaultValue: false,
      defaultStyle: DEFAULT_STYLE,
    })

    this.$element.name = 'checkbox'
    this.$element.value = 'checkbox'
    this.$element.type = 'checkbox'
  }
}
