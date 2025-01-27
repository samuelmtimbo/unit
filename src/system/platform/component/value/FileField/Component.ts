import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
}

export default class FileField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const defaultStyle = $system.style['filefield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      eventKey: 'files',
      emit: false,
      defaultStyle,
      defaultValue: '',
      defaultAttr: {
        type: 'file',
        multiple: 'true',
      },
      processValue: (files: FileList) => {
        const names: {
          lastModified: number
          name: string
          size: number
          type: string
        }[] = []

        for (const file of files) {
          const { lastModified, name, size, type } = file

          names.push({ lastModified, name, size, type })
        }

        return names
      },
    })
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
