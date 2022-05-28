import { Element } from '../../../client/element'
import parentElement from '../../../client/platform/web/parentElement'
import { Pod } from '../../../pod'
import { System } from '../../../system'
import { IHTMLDivElement } from '../../../types/global/dom'
import { UnitBundleSpec } from '../../../types/UnitBundleSpec'

export interface Props {
  graph: UnitBundleSpec
}

export const DEFAULT_STYLE = {
  cursor: 'pointer',
  color: 'currentColor',
  touchAction: 'none',
}

export default class Client extends Element<IHTMLDivElement, Props> {
  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {} = this.$props

    const $element = parentElement($system)

    this.$element = $element
    this.$subComponent = {}
  }

  onPropChanged(prop: string, current: any) {
    console.log('Client', 'onPropChanged', prop, current)
    if (prop === 'graph') {
      //
    }
  }
}
