import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { IHTMLInputElement } from '../../../../../types/global/dom'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: number
  min?: number
  max?: number
  disabled?: boolean
}

export const DEFAULT_STYLE = {
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  textAlign: 'center',
  padding: '0',
  margin: '0',
  fontSize: '12px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export default class Slider extends Field<IHTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultValue: '0',
      defaultStyle: DEFAULT_STYLE,
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
