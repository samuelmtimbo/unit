import HTMLElement_ from '../../../../client/html'
import { System } from '../../../../system'

export interface Props {}

export default class Parent extends HTMLElement_<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('div'),
      {},
      {},
      {}
    )

    this.$element.style.display = 'contents'
  }

  focus() {
    this.$parentChildren[0] && this.$parentChildren[0].focus()
  }
}
