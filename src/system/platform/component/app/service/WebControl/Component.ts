import { Component } from '../../../../../../client/component'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import CloudTabs from '../../../../../host/component/IconTabs/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {}

export default class Web extends Component<HTMLDivElement, Props> {
  private _tabs: CloudTabs

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const tabs = new CloudTabs(
      {
        style,
      },
      this.$system,
      this.$pod
    )
    this._tabs = tabs

    const $element = parentElement($system)

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
