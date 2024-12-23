import { unitBundleSpec } from '../bundle'
import { Unit } from '../Class/Unit'
import { System } from '../system'
import { Specs } from '../types'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'
import { remapSpecs } from './remapBundle'

export function bundleClass<T extends Unit = any>(
  Class: UnitClass<T>,
  bundle: UnitBundleSpec,
  specs: Specs
): UnitBundle<T> {
  const { unit } = bundle

  const { id, memory } = unit

  if (!bundle.specs) {
    bundle = unitBundleSpec(unit, specs)
  }

  // @ts-ignore
  class Bundle extends Class {
    static __bundle = bundle

    constructor(system: System, push: boolean) {
      if (bundle.specs) {
        const map = system.injectSpecs(bundle.specs)

        remapSpecs(bundle, map)
      }

      super(system, id, push)

      if (memory) {
        this.restore(memory)
      }
    }
  }

  // @ts-ignore
  return Bundle
}
