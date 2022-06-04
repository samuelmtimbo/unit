import { Pod } from '../pod'
import { System } from '../system'
import { Component } from './component'

export class Slot extends Component<any, any, any> {
  constructor($props: any, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const $element = $system.method.createSlot()

    this.$element = $element
  }
}
