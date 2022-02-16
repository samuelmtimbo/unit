import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { IHTMLDivElement } from '../../../../types/global/dom'

export interface Props {}

const DEFAULT_STYLE = {}

export default class Parent extends Element<IHTMLDivElement, Props> {
  private _parent_el: IHTMLDivElement

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {} = this.$props

    const $element = parentElement($system)

    this._parent_el = $element

    this.$element = $element
  }
}
