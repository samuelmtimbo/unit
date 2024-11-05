import { Field } from '../../../../../client/field'
import { processNumberValue } from '../../../../../client/processNumberValue'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: number
  max?: number
  min?: number
  disabled?: boolean
}

export default class NumberField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const {
      flags: { defaultInputModeNone },
    } = $system

    const defaultStyle = $system.style['numberfield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle,
      defaultValue: '0',
      defaultAttr: {
        type: 'number',
        // Chrome inputmode 'none' not working on mobile for input type number
        inputmode: defaultInputModeNone ? 'none' : 'number',
      },
      processValue: processNumberValue,
      propHandlers: {
        min: (min: number | undefined) => {
          if (min === undefined) {
            this.$element.removeAttribute('min')
          } else {
            this.$element.min = `${min}`
          }
        },
        max: (max: number | undefined) => {
          if (max === undefined) {
            this.$element.removeAttribute('max')
          } else {
            this.$element.max = `${max}`
          }
        },
      },
    })

    const { min, max } = $props

    if (min !== undefined) {
      this.$element.min = `${min}`
    }
    if (max !== undefined) {
      this.$element.max = `${max}`
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }

  getValue({}: {}, callback: (data: number) => void): void {
    const value = Number.parseFloat(this.$element.value || '0')

    callback(value)
  }

  setValue(
    { value }: { value: number },
    callback: (data: number) => void
  ): void {
    this.$element.value = value.toString()

    callback(value)
  }
}
