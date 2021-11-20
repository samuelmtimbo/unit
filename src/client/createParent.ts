import { System } from '../system'
import { Component } from './component'
import parentElement from './parentElement'

export function parentClass(): typeof Component {
  class Parent extends Component<any, any, any> {
    constructor($props: any, $system: System) {
      super($props, $system)

      const $element = parentElement()

      this.$element = $element
      this.$primitive = false
    }
  }
  return Parent
}

export function parentComponent($props: any, $system: System): Component {
  const Parent = parentClass()
  const component = new Parent($props, $system)
  return component
}
