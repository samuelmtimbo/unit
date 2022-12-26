import { evaluate } from '../spec/evaluate'
import { ComponentClass, System } from '../system'
import { GraphSpec, GraphUnitPinsSpec } from '../types'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId<T = any>(
  $system: System,
  id: string,
  inputs: GraphUnitPinsSpec = {},
  sub_component_map: Dict<Component> = {}
): ComponentClass<T> {
  const { components, specs, classes } = $system

  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id] as ComponentClass<T>

    return class NewClass extends Class {
      static id = id

      constructor($props, $system) {
        super($props, $system)

        for (const name in inputs) {
          const input = inputs[name]

          const { data } = input

          const _data = evaluate(data, specs, classes)

          // @ts-ignore
          this.setProp(name, _data)
        }
      }
    }
  } else {
    return componentClassFromSpec(spec as GraphSpec, specs, sub_component_map)
  }
}
