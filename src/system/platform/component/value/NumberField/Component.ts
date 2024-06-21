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

export const DEFAULT_STYLE = {
  height: 'fit-content',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  textAlign: 'center',
  padding: '0',
  fontSize: '18px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
}

export default class NumberField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '0',
      processValue: processNumberValue,
    })

    const { min, max } = $props

    const {
      flags: { defaultInputModeNone },
    } = $system

    this.$element.type = 'number'

    // Chrome
    // inputMode 'none' not working on mobile for input type number
    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }

    if (min !== undefined) {
      this.$element.min = `${min}`
    }

    if (max !== undefined) {
      this.$element.max = `${max}`
    }
  }

  onPropChanged(prop: string, current: any): void {
    super.onPropChanged(prop, current)

    if (prop === 'min') {
      if (current === undefined) {
        this.$element.removeAttribute('min')
      } else {
        this.$element.min = `${current}`
      }
    } else if (prop === 'max') {
      if (current === undefined) {
        this.$element.removeAttribute('max')
      } else {
        this.$element.max = `${current}`
      }
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
