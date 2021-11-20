import { Element } from '../../../../client/element'
import parentElement from '../../../../client/parentElement'

export interface Props {}

const DEFAULT_STYLE = {}

export default class Div extends Element<HTMLDivElement, Props> {
  private _parent_el: HTMLDivElement

  constructor($props: Props) {
    super($props)

    const {} = this.$props

    const $element = parentElement()

    this._parent_el = $element

    this.$element = $element
  }
}
