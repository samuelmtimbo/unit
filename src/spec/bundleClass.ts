import { Unit } from '../Class/Unit'
import { System } from '../system'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'
import { remapSpecs } from './remapBundle'

export function bundleClass<T extends Unit = any>(
  Class: UnitClass<T>,
  bundle: UnitBundleSpec
): UnitBundle<T> {
  const {
    unit: { id, memory },
  } = bundle

  // @ts-ignore
  class Bundle extends Class {
    static __bundle = bundle

    constructor(system: System) {
      if (bundle.specs) {
        const map = system.injectSpecs(bundle.specs)

        remapSpecs(bundle, map)
      }

      super(system, id)

      if (memory) {
        this.restore(memory)
      }
    }
  }

  // @ts-ignore
  return Bundle
}
