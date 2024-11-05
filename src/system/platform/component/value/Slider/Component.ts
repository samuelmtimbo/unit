import { Field } from '../../../../../client/field'
import { processNumberValue } from '../../../../../client/processNumberValue'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: number
  min?: number
  max?: number
  disabled?: boolean
  attr?: Dict<string>
}

export default class Slider extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultValue: '0',
      defaultStyle: $system.style['textarea'],
      defaultAttr: {
        type: 'range',
      },
      processValue: processNumberValue,
      propHandlers: {
        min: (min: number = 0) => {
          this.$element.min = `${min}`
        },
        max: (max: number = 100) => {
          this.$element.min = `${max}`
        },
      },
    })

    const { min = 0, max = 100 } = $props

    this.$element.min = `${min}`
    this.$element.max = `${max}`
  }
}
