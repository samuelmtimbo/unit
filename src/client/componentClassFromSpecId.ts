import { Memory } from '../Class/Unit/Memory'
import { ComponentClass, ComponentClasses } from '../system'
import merge from '../system/f/object/Merge/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { mapObjVK } from '../util/object'
import { IOElement } from './IOElement'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId<T = any>(
  components: ComponentClasses,
  specs: Specs,
  id: string,
  memory?: Partial<Memory>,
  subComponentMap: Dict<Component> = {},
  element: IOElement = undefined
): ComponentClass<T> {
  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id] as ComponentClass<T>

    const props = mapObjVK(memory?.input ?? {}, ({ _register }) => {
      return _register
    })

    return class NewClass extends Class {
      static id = id

      constructor($props, $system) {
        super(merge(props, $props) as T, $system, element)
      }
    }
  } else {
    return componentClassFromSpec(
      spec as GraphSpec,
      specs,
      subComponentMap,
      memory
    )
  }
}
