import { Component } from '../../../../../client/component'
import { Element } from '../../../../../client/element'
import { System } from '../../../../../system'

export interface Props {
  value?: string
}

export default class _Text extends Element<Text, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system)

    const { value = '' } = $props

    const text_node = this.$system.api.document.createTextNode(value)

    this.$element = text_node
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'value') {
      this.$element.nodeValue = current ?? ''
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

  domAppendChild(component: Component): void {
    // NOOP
  }

  domRemoveChild(component: Component): void {
    // NOOP
  }

  domInsertParentChildAt(component: Component): void {
    // NOOP
  }

  domRemoveParentChildAt(component: Component): void {
    // NOOP
  }
}
