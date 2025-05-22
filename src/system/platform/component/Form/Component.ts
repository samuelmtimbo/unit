import HTMLElement_ from '../../../../client/html'
import { System } from '../../../../system'
import { I } from './'

export interface Props extends I {}

export default class Form extends HTMLElement_<HTMLFormElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('form'),
      $system.style['form'],
      {},
      {}
    )
  }
}
