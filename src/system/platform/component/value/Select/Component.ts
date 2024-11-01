import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  maxLength?: number
  tabIndex?: number
}

export default class Select extends Field<HTMLSelectElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['select']

    super($props, $system, $system.api.document.createElement('select'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    const { tabIndex } = $props

    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
  }
}
