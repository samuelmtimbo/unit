import { Unit } from '../Class/Unit'
import { UnitBundle } from '../types/UnitBundle'
import { fromBundle } from './fromBundle'

export function cloneUnit<T extends Unit>(unit: T): T {
  const { __system } = unit

  const NewBundle = cloneUnitClass(unit)

  const newUnit = new NewBundle(__system)

  return newUnit
}

export function cloneUnitClass<T extends Unit>(unit: T): UnitBundle<T> {
  const { __system } = unit

  const specs = __system.specs

  const bundle = unit.getUnitBundleSpec()

  // console.log(JSON.stringify(bundle, null, 2))

  const NewBundle = fromBundle<T>(bundle, specs, __system.classes)

  return NewBundle
}
