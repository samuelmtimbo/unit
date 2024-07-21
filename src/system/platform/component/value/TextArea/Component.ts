import { mergeAttr } from '../../../../../client/attr'
import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  placeholder?: string
  maxLength?: number
  attr?: Dict<any>
}

export const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  textAlign: 'left',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  fontSize: '21px',
  display: 'flex',
  justifyContent: 'center',
  background: 'none',
  backgroundColor: '#00000000',
  padding: '0',
  border: 'none',
  overflowX: 'hidden',
  overflowY: 'auto',
  resize: 'none',
  // outline: 'none',
  boxSizing: 'border-box',
  color: 'currentColor',
}

export default class TextArea extends Field<HTMLTextAreaElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('textarea'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
    })

    const {
      flags: { defaultInputModeNone },
    } = $system

    const { placeholder = '', maxLength = undefined, attr } = $props

    this.$element.spellcheck = false
    this.$element.autocomplete = 'off'
    // this.$element.autocorrect = 'off'
    this.$element.autocapitalize = 'off'
    this.$element.inputMode = 'text'

    if (defaultInputModeNone) {
      this.$element.inputMode = 'none'
    }

    this.$element.placeholder = placeholder

    if (maxLength !== undefined) {
      this.$element.maxLength = maxLength
    }

    mergeAttr(this.$element, attr ?? {})
  }
}
