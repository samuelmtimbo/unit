import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import { System } from '../system'
import { Specs } from '../types'
import { UnitBundle } from '../types/UnitBundle'
import { UnitClass } from '../types/UnitClass'
import { bundleClass } from './bundleClass'

export function cloneBundle<T extends Unit = any>(
  unit: T,
  deep: boolean = false,
  specs: Specs
): UnitBundle<T> {
  const __bundle = unit.getUnitBundleSpec(deep)

  let Class = unit.constructor as { new (...args: any[]): Unit }

  if (unit instanceof Graph) {
    const spec = unit.getSpec()

    Class = class Bundle extends Class {
      constructor(system: System, id: string) {
        super(spec, {}, system, id)
      }
    }
  }

  return bundleClass(Class as UnitClass, __bundle, specs)
}
