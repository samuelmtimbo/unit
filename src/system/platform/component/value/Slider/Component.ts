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
    const DEFAULT_STYLE = $system.style['textarea']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultValue: '0',
      defaultStyle: DEFAULT_STYLE,
      processValue: processNumberValue,
    })

    const { min = 0, max = 100 } = $props

    this.$element.type = 'range'
    this.$element.min = `${min}`
    this.$element.max = `${max}`
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'min') {
      this.$element.min = `${current}`
    } else if (prop === 'max') {
      this.$element.max = `${current}`
    } else {
      super.onPropChanged(prop, current)
    }
  }
}
