import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  attr?: Dict<any>
}

export default class EditableField extends Field<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('div'), {
      valueKey: 'innerText',
      defaultStyle: $system.style['editablefield'],
      defaultValue: '',
      defaultAttr: {
        contenteditable: 'true',
        spellcheck: 'false',
        autocapitalize: 'off',
      },
    })
  }

  blur(): void {
    const {
      api: {
        document: { getSelection },
      },
    } = this.$system

    super.blur()

    getSelection().removeAllRanges()
  }
}
