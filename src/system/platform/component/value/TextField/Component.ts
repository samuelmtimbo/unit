import { mergeAttr } from '../../../../../client/attr'
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
  attr?: Dict<any>
}

export default class TextField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['textfield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    const {
      flags: { defaultInputModeNone },
    } = $system

    const { maxLength, tabIndex, attr } = $props

    this.$element.type = 'text'
    this.$element.spellcheck = false
    this.$element.autocomplete = 'off'
    // this.$element.autocomplete = 'disabled'
    // this.$element.autocorrect = 'off'
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'text'
    // this.$element.autofocus = false

    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }
    if (maxLength !== undefined) {
      this.$element.maxLength = maxLength
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }

    mergeAttr(this.$element, attr ?? {})
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
