import { Unit } from '../Class/Unit'
import { Pod } from '../pod'
import { System } from '../system'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'

export function bundleClass<T extends Unit = any>(
  Class: UnitClass<T>,
  __bundle: UnitBundleSpec
): UnitBundle<T> {
  const { unit } = __bundle

  const { id } = unit

  // @ts-ignore
  return class Bundle extends Class {
    _ = id

    static readonly __bundle = __bundle

    constructor(system: System, pod: Pod) {
      super(system, pod)

      const { memory } = unit

      if (memory) {
        this.restore(memory)
      }
    }
  }
}
