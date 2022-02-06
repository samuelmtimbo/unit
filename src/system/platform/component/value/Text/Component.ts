import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface Props {
  value?: string
}

export default class _Text extends Element<Text, Props> {
  private _text_el: Text

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { value = '' } = $props

    const text_node = this.$system.api.document.createTextNode(value)

    this._text_el = text_node

    this.$element = text_node
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'value') {
      this._text_el.nodeValue = current ?? ''
    }
  }

  focus(options: FocusOptions | undefined = { preventScroll: true }) {
    // NOOP
  }

  blur() {
    // NOOP
  }
}
