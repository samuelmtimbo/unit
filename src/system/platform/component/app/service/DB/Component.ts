import { Component } from '../../../../../../client/component'
import parentElement from '../../../../../../client/parentElement'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import CloudTabs from '../../../../../host/component/IconTabs/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {}

export default class DBService extends Component<HTMLDivElement, Props> {
  private _tabs: CloudTabs

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style } = $props

    const tabs = new CloudTabs(
      {
        style,
      },
      this.$system
    )
    this._tabs = tabs

    const $element = parentElement()

    this.$element = $element
    this.$slot = tabs.$slot
    this.$subComponent = {
      tabs,
    }
    this.$unbundled = false

    this.registerRoot(tabs)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._tabs.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  onMount(): void {}
}
