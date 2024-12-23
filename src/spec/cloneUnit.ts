import { Unit } from '../Class/Unit'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { $clone } from '../util/$clone'
import { fromUnitBundle } from './fromUnitBundle'

export function cloneUnit<T extends Unit>(
  unit: T,
  deep: boolean = false
): [T, UnitBundleSpec] {
  const { __system } = unit

  const [NewBundle, bundle] = cloneUnitClass(unit, deep)

  const newUnit = new NewBundle(__system, false)

  return [newUnit, bundle]
}

export function cloneUnitClass<T extends Unit>(
  unit: T,
  deep: boolean = false
): [UnitBundle<T>, UnitBundleSpec] {
  const { __system } = unit

  const { specs } = __system

  const bundle_ = unit.getUnitBundleSpec(deep)

  const bundle = $clone(bundle_)

  const NewBundle = fromUnitBundle<T>(bundle, specs, __system.classes)

  return [NewBundle, bundle]
}
