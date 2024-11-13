import HTMLElement_ from '../../../../client/html'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  attr?: Dict<string>
}

export default class Details extends HTMLElement_<HTMLDetailsElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('details'),
      $system.style['details'],
      {},
      {}
    )
  }
}
