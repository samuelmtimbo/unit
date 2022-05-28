import { Pod } from '../pod'
import { ComponentClass, System } from '../system'
import { GraphSpec } from '../types'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'
import parentElement from './platform/web/parentElement'

export function componentClassFromSpec(spec: GraphSpec): ComponentClass {
  const {
    id,
    name,
    units = {},
    component = { defaultWidth: 120, defaultHeight: 120 },
  } = spec

  const { children = [], subComponents = {}, slots = [] } = component

  class Parent extends Component<any, any> {
    static id = id

    constructor($props: {}, $system: System, $pod: Pod) {
      super($props, $system, $pod)

      const $subComponent: Dict<Component> = {}

      for (const unitId in subComponents) {
        const unitSpec = units[unitId]
        const { id } = unitSpec
        const Class = componentClassFromSpecId($system, { ...this.$system.specs, ...this.$pod.specs }, id)
        const childComponent: Component = new Class({}, $system, $pod)
        $subComponent[unitId] = childComponent
      }

      const fillParentRoot = (unitId: string): void => {
        const component = $subComponent[unitId]
        const subComponentSpec = subComponents[unitId] || {}
        const { children = [], childSlot = {} } = subComponentSpec
        for (const childUnitId of children) {
          fillParentRoot(childUnitId)
          const slot = childSlot[childUnitId] || 'default'
          const childRoot: Component = $subComponent[childUnitId]
          component.registerParentRoot(childRoot, slot)
        }
      }

      const $element = parentElement($system)

      this.$element = $element
      this.$primitive = false
      this.$subComponent = $subComponent

      let i = 0
      for (const _slot of slots) {
        const [slot, slotSlot] = _slot
        const subComponent = $subComponent[slot]
        // AD HOC
        const slotName = i === 0 ? 'default' : `${i}`
        this.$slot[slotName] = subComponent.$slot[slotSlot]
        this.$slotId[slotName] = slot
        this.$slotTarget[slotName] = slotSlot
        i++
      }

      for (let child_id of children) {
        const rootComponent = $subComponent[child_id]
        fillParentRoot(child_id)
        this.registerRoot(rootComponent)
      }
    }
  }

  Object.defineProperty(Parent, 'name', {
    value: name,
  })

  return Parent as ComponentClass
}
