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

export const DEFAULT_STYLE = {
  height: 'fit-content',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '18px',
  // outlineColor: '#00000000',
  border: 'none',
  borderRadius: '0',
}

export default class Select extends Field<HTMLSelectElement, Props> {
  constructor($props: Props, $system: System) {
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
