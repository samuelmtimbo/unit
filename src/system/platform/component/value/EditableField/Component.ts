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
  height: 'fit-content',
  width: '100%',
  color: 'inherit',
  backgroundColor: '#00000000',
  padding: '0',
  fontSize: '18px',
  // outlineColor: '#00000000',
  border: 'none',
  borderRadius: '0',
}

export default class EditableField extends Field<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('div'), {
      valueKey: 'textContent',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    this.$element.contentEditable = 'true'

    const {
      flags: { defaultInputModeNone },
    } = $system

    const { maxLength, tabIndex } = $props

    this.$element.spellcheck = false
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'text'

    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }

    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
  }

  // setSelectionRange(
  //   start: number,
  //   end: number,
  //   direction?: 'forward' | 'backward' | 'none' | undefined
  // ) {
  //   this.$element.setSelectionRange(start, end, direction)
  // }
}
