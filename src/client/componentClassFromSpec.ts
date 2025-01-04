import { Memory } from '../Class/Unit/Memory'
import { ComponentClass, System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { $Component } from '../types/interface/async/$Component'
import { $Graph } from '../types/interface/async/$Graph'
import { clone } from '../util/clone'
import { weakMerge } from '../weakMerge'
import { IOElement } from './IOElement'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'
import { parentElement } from './platform/web/parentElement'

export function componentClassFromSpec<
  E extends IOElement = any,
  P = any,
  U extends $Component | $Graph = any,
>(
  spec: GraphSpec,
  specs: Specs,
  sub_component_map: Dict<Component> = {},
  memory?: Partial<Memory>
): typeof Component<E, P, U> {
  const {
    id,
    name,
    units = {},
    component = { defaultWidth: 120, defaultHeight: 120 },
  } = clone(spec)

  const { children = [], subComponents = {}, slots = [] } = component

  class Parent extends Component<any, any> {
    static id = id

    constructor($props: {}, $system: System) {
      super($props, $system)

      for (const unitId in subComponents) {
        const unitSpec = units[unitId]
        const { id } = unitSpec

        let childComponent = sub_component_map[unitId]

        if (!childComponent) {
          const specs_ = weakMerge($system.specs, specs)

          const Class = componentClassFromSpecId(
            $system.components,
            specs_,
            id,
            memory?.memory?.unit?.[unitId] ?? unitSpec.memory
          )

          childComponent = new Class({}, $system)
        }

        this.setSubComponent(unitId, childComponent)
      }

      const fillParentRoot = (unitId: string): void => {
        const component = this.$subComponent[unitId]
        const subComponentSpec = subComponents[unitId] || {}

        const { children = [], childSlot = {} } = subComponentSpec

        for (const childUnitId of children) {
          fillParentRoot(childUnitId)

          const slotName = childSlot[childUnitId] || 'default'
          const childRoot: Component = this.$subComponent[childUnitId]

          component.registerParentRoot(childRoot, slotName)
        }
      }

      const $element = parentElement($system)

      this.$element = $element
      this.$primitive = false

      let i = 0
      for (const _slot of slots) {
        const [slot, slotSlot] = _slot

        const subComponent = this.$subComponent[slot]

        const slotName = i === 0 ? 'default' : `${i}`

        this.$slot[slotName] = subComponent.$slot[slotSlot]
        this.$slotId[slotName] = slot
        this.$slotTarget[slotName] = slotSlot

        i++
      }

      for (let child_id of children) {
        const rootComponent = this.$subComponent[child_id]
        fillParentRoot(child_id)
        this.registerRoot(rootComponent)
      }
    }

    onDestroy(): void {
      super.onDestroy()

      for (const unitId in this.$subComponent) {
        const component = this.$subComponent[unitId]

        component.destroy()
      }
    }
  }

  Object.defineProperty(Parent, 'name', {
    value: name,
  })

  return Parent as ComponentClass
}
