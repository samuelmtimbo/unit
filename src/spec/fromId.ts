import { Unit } from '../Class/Unit'
import { System } from '../system'
import { Classes, Spec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { UnitBundle } from '../types/UnitBundle'
import { UnitClass } from '../types/UnitClass'
import { lazyFromSpec } from './Lazy'
import { SpecNotFoundError } from './SpecNotFoundError'
import { bundleClass } from './bundleClass'
import { classFromSpec, fromSpec, graphFromSpec } from './fromSpec'
import { getSpec } from './util'

export function bundleFromId<T extends Unit>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {}
): UnitBundle<T> {
  const Class: UnitClass = classFromId(id, specs, classes, branch)

  const bundle = { unit: { id }, specs: {} }

  const Bundle = bundleClass(Class, bundle, specs)

  return Bundle
}

export function classFromId<T extends Unit>(
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true> = {}
): UnitClass<T> {
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
      Class = classFromSpec(spec, specs, classes, {
        ...branch,
        [id]: true,
      })
    }
  }

  return Class
}

export function unitFromId<I, O>(
  system: System,
  id: string,
  specs: Specs,
  classes: Classes,
  branch: Dict<true>,
  push: boolean
): Unit<I, O> {
  let spec: Spec = getSpec(specs, id)

  let unit: Unit<I, O>

  let Class: UnitClass = classes[id]

  if (Class === undefined) {
    spec = spec as GraphSpec

    if (branch[id]) {
      const Class = lazyFromSpec(spec, specs, branch, fromSpec)

      unit = new Class(system, id)
    } else {
      unit = graphFromSpec(
        system,
        spec,
        specs,
        {
          ...branch,
          [id]: true,
        },
        push
      )
    }
  } else {
    unit = new Class(system, id)
  }

  return unit
}
