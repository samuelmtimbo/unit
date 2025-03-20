import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { SEL, SelectionObject } from '../../../../../types/interface/SEL'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  placeholder?: string
  attr?: Dict<any>
}

export default class TextArea
  extends Field<HTMLTextAreaElement, Props>
  implements SEL
{
  constructor($props: Props, $system: System) {
    const {
      flags: { defaultInputModeNone },
    } = $system

    super($props, $system, $system.api.document.createElement('textarea'), {
      valueKey: 'value',
      defaultStyle: $system.style['textarea'],
      defaultAttr: {
        spellcheck: false,
        autocomplete: 'off',
        autocapitalize: 'off',
        inputmode: defaultInputModeNone ? 'none' : 'text',
      },
      propHandlers: {
        placeholder: (placeholder: string | undefined) => {
          this.$element.placeholder = placeholder
        },
      },
    })

    const { placeholder = '' } = $props

    this.$element.placeholder = placeholder
  }

  getSelection(): SelectionObject[] {
    const { selectionStart, selectionEnd, selectionDirection } = this.$element

    return [
      {
        path: [],
        start: selectionStart,
        end: selectionEnd,
        direction: selectionDirection,
      },
    ]
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ): void {
    this.$element.setSelectionRange(
      start ?? null,
      end ?? null,
      direction ?? 'none'
    )
  }
}
