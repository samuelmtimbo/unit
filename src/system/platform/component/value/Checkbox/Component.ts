import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLInputElement } from '../../../../../types/global/dom'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: boolean
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  color: 'inherit',
  margin: '0',
  backgroundColor: '#00000000',
  padding: '0',
  // outline: 'none',
}

export default class Checkbox extends Field<IHTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
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
