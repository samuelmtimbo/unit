import { Unit } from '../Class/Unit'
import { Classes, Spec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { UnitBundle } from '../types/UnitBundle'
import { UnitClass } from '../types/UnitClass'
import { lazyFromSpec } from './Lazy'
import { SpecNotFoundError } from './SpecNotFoundError'
import { bundleClass } from './bundleClass'
import { _fromSpec, fromSpec } from './fromSpec'

export function fromId<T extends Unit>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {} // TODO branch should be an in memory tree
): UnitBundle<T> {
  let spec: Spec = specs[id]

  if (!spec) {
    throw new SpecNotFoundError()
  }

  let Class: UnitClass = classes[id]

  if (Class === undefined) {
    spec = spec as GraphSpec

    if (branch[id]) {
      Class = lazyFromSpec(spec, specs, branch, fromSpec)
    } else {
      Class = _fromSpec(spec, specs, {
        ...branch,
        [id]: true,
      })
    }
  }

  const bundle = { unit: { id } }

  const Bundle = bundleClass(Class, bundle)

  return Bundle
}
