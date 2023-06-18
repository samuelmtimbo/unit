import { Unit } from '../Class/Unit'
import { UnitBundle } from '../types/UnitBundle'
import { UnitClass } from '../types/UnitClass'
import { bundleClass } from './bundleClass'

export function cloneBundle<T extends Unit = any>(
  unit: T,
  deep: boolean = false
): UnitBundle<T> {
  const __bundle = unit.getBundle(deep)

  return bundleClass(unit.constructor as UnitClass, __bundle)
}
