import { ComponentClass, System } from '../system'
import { GraphSpec, Specs } from '../types'
import { componentClassFromSpec } from './componentClassFromSpec'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId(
  $system: System,
  specs: Specs,
  id: string
): ComponentClass {
  const { components } = $system

  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id]
    Class.id = id
    return Class
  } else {
    return componentClassFromSpec(spec as GraphSpec)
  }
}
