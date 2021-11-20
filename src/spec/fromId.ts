import _classes from '../system/_classes'
import { Classes, GraphSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'
import { fromSpec } from './fromSpec'
import { lazyFromSpec } from './Lazy'

export function fromId<I, O>(
  id: string,
  specs: Specs,
  branch: Dict<true> = {}
): UnitClass {
  // @ts-ignore
  const classes: Classes = globalThis.__classes || _classes
  let Class: UnitClass = classes[id]
  if (Class === undefined) {
    const spec = specs[id]
    if (branch[id]) {
      Class = lazyFromSpec(spec as GraphSpec, specs, branch)
    } else {
      if (!spec) {
        console.log(specs)
        throw new Error(id)
      }
      Class = fromSpec<I, O>(spec as GraphSpec, specs, {
        ...branch,
        [id]: true,
      })
    }
  }
  Object.defineProperty(Class, 'id', {
    value: id,
  })
  return Class
}
