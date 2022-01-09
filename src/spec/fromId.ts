import { _cloneUnitClass } from '../cloneUnitClass'
import { Classes, GraphSpec, Spec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'
import { bundleClass } from './bundleClass'
import { fromSpec } from './fromSpec'
import { lazyFromSpec } from './Lazy'
import { SpecNotFoundError } from './SpecNotFoundError'

export function fromId<I, O>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {}
): UnitClass {
  let spec: Spec = specs[id]

  let Class: UnitClass = classes[id]

  if (Class === undefined) {
    spec = spec as GraphSpec

    if (branch[id]) {
      Class = lazyFromSpec(spec, specs, branch)
    } else {
      if (!spec) {
        console.log(id)
        throw new SpecNotFoundError()
      }

      Class = fromSpec<I, O>(spec, specs, {
        ...branch,
        [id]: true,
      })
    }
  }

  Class = _cloneUnitClass(Class)

  bundleClass(Class, { unit: { id } })

  return Class
}
