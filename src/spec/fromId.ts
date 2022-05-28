import { Unit } from '../Class/Unit'
import { Classes, GraphSpec, Spec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'
import { UnitBundle } from "../types/UnitBundle"
import { bundleClass } from './bundleClass'
import { fromSpec, _fromSpec } from './fromSpec'
import { lazyFromSpec } from './Lazy'
import { SpecNotFoundError } from './SpecNotFoundError'

export function fromId<T extends Unit>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {}
): UnitBundle<T> {
  let spec: Spec = specs[id]

  if (!spec) {
    console.log(id)
    throw new SpecNotFoundError()
  }

  let Class: UnitClass = classes[id]

  if (Class === undefined) {
    spec = spec as GraphSpec

    if (branch[id]) {
      Class = lazyFromSpec(spec, specs, branch)
    } else {
      Class = _fromSpec(spec, specs, {
        ...branch,
        [id]: true,
      })
    }
  }

  const Bundle = bundleClass(Class, { unit: { id } })

  return Bundle
}
