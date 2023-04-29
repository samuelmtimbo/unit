import { Element } from '../../../../../client/element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
}

export const DEFAULT_STYLE = {}

export default class Option extends Element<HTMLOptionElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('option'))
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Option', 'onPropChanged', prop, current)

    super.onPropChanged(prop, current)

    if (prop === 'value') {
      if (current === undefined) {
        this.$element.value = current
      }
    }
  }
}
