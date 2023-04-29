import { Unit } from '../Class/Unit'
import { System } from '../system'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'

export function bundleClass<T extends Unit = any>(
  Class: UnitClass<T>,
  bundle: UnitBundleSpec
): UnitBundle<T> {
  const {
    unit: { id, memory },
  } = bundle

  // @ts-ignore
  return class Bundle extends Class {
    static readonly __bundle = bundle

    constructor(system: System) {
      super(system, id)

      if (memory) {
        this.restore(memory)
      }
    }
  }
}
