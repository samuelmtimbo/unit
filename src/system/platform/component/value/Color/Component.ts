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
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: $system.style['color'],
      defaultValue: $system.color,
      defaultAttr: {
        type: 'color',
      },
      parseValue(value) {
        if (value) {
          value = nameToColor(value) ?? value
        }

        return value
      },
    })
  }
}
