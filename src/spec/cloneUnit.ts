import { Unit } from '../Class/Unit'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { clone } from '../util/object'
import { fromUnitBundle } from './fromUnitBundle'

export function cloneUnit<T extends Unit>(
  unit: T,
  deep: boolean = false
): [T, UnitBundleSpec] {
  const { __system } = unit

  const [NewBundle, bundle] = cloneUnitClass(unit, deep)

  const newUnit = new NewBundle(__system)

  return [newUnit, bundle]
}

export function cloneUnitClass<T extends Unit>(
  unit: T,
  deep: boolean = false
): [UnitBundle<T>, UnitBundleSpec] {
  const { __system } = unit

  const specs = __system.specs

  const bundle = clone(unit.getUnitBundleSpec(deep))

  const NewBundle = fromUnitBundle<T>(bundle, specs, __system.classes)

  return [NewBundle, bundle]
}
