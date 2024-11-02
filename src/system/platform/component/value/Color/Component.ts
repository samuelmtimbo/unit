import { nameToColor } from '../../../../../client/color'
import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  attr?: Dict<string>
  disabled?: boolean
  tabIndex?: number
}

export default class Color extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['color']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: $system.color,
      parseValue(value) {
        if (value) {
          value = nameToColor(value) ?? value
        }

        return value
      },
    })

    const { value = $system.color, tabIndex = -1 } = $props

    this.$element.value = value
    this.$element.type = 'color'
    this.$element.tabIndex = tabIndex
  }
}
