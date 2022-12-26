import { Element } from '../../../../../client/element'
import { System } from '../../../../../system'

export interface Props {
  value?: string
}

export default class _Text extends Element<Text, Props> {
  private _text_el: Text

  constructor($props: Props, $system: System) {
    super($props, $system)

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

  onMount() {
    // console.log('_Text', 'onMount')
  }

  onUnmount() {
    // console.log('_Text', 'onUnmount')
  }
}
