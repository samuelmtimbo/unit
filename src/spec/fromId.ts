import _classes from '../system/_classes'
import { Classes, GraphSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'
import { fromSpec } from './fromSpec'
import { lazyFromSpec } from './Lazy'
import { SpecNotFoundError } from './SpecNotFoundError'

export function fromId<I, O>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {}
): UnitClass {
  let Class: UnitClass = classes[id]

  if (Class === undefined) {
    const spec = specs[id] as GraphSpec

    if (branch[id]) {
      Class = lazyFromSpec(spec, specs, branch)
    } else {
      if (!spec) {
        throw new SpecNotFoundError()
      }

      Class = fromSpec<I, O>(spec, specs, {
        ...branch,
        [id]: true,
      })
    }
  }

  Object.defineProperty(Class, '__id', {
    value: id,
  })

  return Class
}
