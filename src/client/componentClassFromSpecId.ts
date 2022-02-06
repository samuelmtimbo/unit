import { ComponentClass, System } from '../system'
import { GraphSpec } from '../types'
import { componentClassFromSpec } from './component'
import { isBaseSpec } from './id'
import { getSpec } from './spec'

export function componentClassFromSpecId(
  $system: System,
  id: string
): ComponentClass {
  const { specs, components } = $system

  const spec = getSpec(specs, id)

  if (isBaseSpec(spec)) {
    const Class = components[id]
    Class.id = id
    return Class
  } else {
    return componentClassFromSpec(spec as GraphSpec)
  }
}
