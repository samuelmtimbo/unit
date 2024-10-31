import { Unit } from '../Class/Unit'
import { Classes, Specs } from '../types'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { weakMerge } from '../weakMerge'
import { bundleClass } from './bundleClass'
import { classFromId } from './fromId'

export function fromUnitBundle<T extends Unit>(
  bundle: UnitBundleSpec,
  specs: Specs,
  classes: Classes
): UnitBundle<T> {
  const { unit, specs: _specs = {} } = bundle

  const { id } = unit

  const Class = classFromId<T>(id, weakMerge(_specs, specs), classes, {})

  const Bundle = bundleClass<T>(Class, bundle, specs)

  return Bundle
}
