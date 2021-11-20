import { ComponentClass, System } from '../system'
import { GraphSpec } from '../types'
import { isBaseSpecId } from './id'
import { getSpec } from './spec'
import { componentClassFromSpec } from './component'

export function componentClassFromSpecId(
  $system: System,
  id: string
): ComponentClass {
  const { specs, classes, components } = $system

  if (isBaseSpecId(specs, id)) {
    const Class = components[id]
    Class.id = id
    return Class
  } else {
    const spec = getSpec(specs, id) as GraphSpec
    return componentClassFromSpec($system, spec)
  }
}
