import { evaluateDataValue } from '../spec/evaluateDataValue'
import { ComponentClass, ComponentClasses } from '../system'
import { Classes, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { GraphUnitPinsSpec } from '../types/GraphUnitPinsSpec'
import { IOElement } from './IOElement'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId<T = any>(
  components: ComponentClasses,
  specs: Specs,
  classes: Classes,
  id: string,
  inputs: GraphUnitPinsSpec = {},
  subComponentMap: Dict<Component> = {},
  element: IOElement = undefined
): ComponentClass<T> {
  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id] as ComponentClass<T>

    return class NewClass extends Class {
      static id = id

      constructor($props, $system) {
        super($props, $system, element)

        for (const name in inputs) {
          const input = inputs[name]

          const { data } = input

          const dataRef = evaluateDataValue(data, specs, classes)

          this.setProp(name, dataRef.data)
        }
      }
    }
  } else {
    return componentClassFromSpec(spec as GraphSpec, specs, subComponentMap)
  }
}
