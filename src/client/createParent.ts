import { ComponentClass, System } from '../system'
import { Component } from './component'
import { parentElement } from './platform/web/parentElement'

export function parentClass(): ComponentClass {
  class Parent extends Component<any, any, any> {
    constructor($props: any, $system: System) {
      super($props, $system)

      const $element = parentElement($system)

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
