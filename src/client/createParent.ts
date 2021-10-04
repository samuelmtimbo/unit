import { Component } from './component'
import parentElement from './parentElement'

export function parentClass(): typeof Component {
  class Parent extends Component<any, any, any> {
    constructor($props: any) {
      super($props)

      const $element = parentElement()

      this.$element = $element
      this.$primitive = false
    }
  }
  return Parent
}

export function parentComponent($props: any): Component {
  const Parent = parentClass()
  const component = new Parent($props)
  return component
}
