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
  height: '100%',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '18px',
  // outlineColor: '#00000000',
  border: 'none',
  borderRadius: '0',
}

export default class FileField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    const { maxLength, tabIndex } = $props

    this.$element.type = 'file'
    this.$element.spellcheck = false
    this.$element.autocomplete = 'off'
    // this.$element.autocomplete = 'disabled'
    // this.$element.autocorrect = 'off'
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'none'
    // this.$element.inputMode = 'text'

    if (maxLength !== undefined) {
      this.$element.maxLength = maxLength
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
