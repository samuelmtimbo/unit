import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '12px',
  // outline: 'none',
  border: 'none',
  borderRadius: '0',
}

export default class Color extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
    })

    const { value = '#000000', tabIndex = -1 } = $props

    this.$element.value = value
    this.$element.type = 'color'
    this.$element.tabIndex = tabIndex
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
