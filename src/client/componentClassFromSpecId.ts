import { evaluate } from '../spec/evaluate'
import { ComponentClass, System } from '../system'
import { GraphSpec, GraphUnitPinsSpec, Specs } from '../types'
import { componentClassFromSpec } from './componentClassFromSpec'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId<T = any>(
  $system: System,
  specs: Specs,
  id: string,
  inputs: GraphUnitPinsSpec = {}
): ComponentClass<T> {
  const { components, classes } = $system

  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id] as ComponentClass<T>

    return class NewClass extends Class {
      static id = id

      constructor($props, $system, $pod) {
        super($props, $system, $pod)

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
    return componentClassFromSpec(spec as GraphSpec, specs)
  }
}
