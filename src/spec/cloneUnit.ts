import { SnapshotOpt, Unit } from '../Class/Unit'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { $clone } from '../util/$clone'
import { fromUnitBundle } from './fromUnitBundle'

export function cloneUnit<T extends Unit>(
  unit: T,
  opt: SnapshotOpt
): [T, UnitBundleSpec] {
  const { __system } = unit

  const [NewBundle, bundle] = cloneUnitClass(unit, opt)

  const newUnit = new NewBundle(__system, false)

  return [newUnit, bundle]
}

export function cloneUnitClass<T extends Unit>(
  unit: T,
  opt: SnapshotOpt = { deep: false }
): [UnitBundle<T>, UnitBundleSpec] {
  const { __system } = unit

  const { specs } = __system

  const bundle_ = unit.getUnitBundleSpec(opt)

  const bundle = $clone(bundle_)

  const NewBundle = fromUnitBundle<T>(bundle, specs, __system.classes)

  return [NewBundle, bundle]
}
