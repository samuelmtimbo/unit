import HTMLElement_ from '../../../../../client/html'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
}

export default class Option extends HTMLElement_<HTMLOptionElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('option'),
      $system.style['option']
    )

    this.$propHandler = {
      ...this.$propHandler,
      value: (current) => {
        this.$element.value = current
      },
    }
  }
}
