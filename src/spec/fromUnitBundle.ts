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
  const { unit } = bundle

  const { id } = unit

  const specs_ = weakMerge(specs, bundle.specs ?? {})

  const Class = classFromId<T>(id, specs_, classes, {})

  const Bundle = bundleClass(Class, bundle, specs_)

  return Bundle
}
