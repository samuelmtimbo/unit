import { unitBundleSpec } from '../bundle'
import { System } from '../system'
import { Specs } from '../types'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'
import { remapSpecs } from './remapBundle'

export function bundleClass(
  Class: UnitClass,
  bundle: UnitBundleSpec,
  specs: Specs
): UnitBundle {
  const { unit } = bundle

  let { id, memory } = unit

  if (!bundle.specs) {
    bundle = unitBundleSpec(unit, specs)
  }

  class Bundle extends Class {
    static readonly __bundle = bundle

    constructor(system: System, push: boolean) {
      if (bundle.specs) {
        const map = system.injectSpecs(bundle.specs)

        remapSpecs(bundle, map)

        id = map[id] ?? id

        bundle.unit.id = id
      }

      super(system, id, push || !memory)

      if (memory) {
        this.restore(memory)
      }
    }
  }

  // @ts-ignore
  return Bundle
}
