import { bundleClass } from './spec/bundleClass'
import { Specs } from './types'
import { UnitBundle } from './types/UnitBundle'
import { UnitBundleSpec } from './types/UnitBundleSpec'
import { UnitClass } from './types/UnitClass'
import { clone } from './util/clone'

export function cloneUnitBundle(Bundle: UnitBundle, specs: Specs): UnitBundle {
  const { __bundle } = Bundle

  const bundle = clone(__bundle)

  return _cloneUnitBundle(Bundle, bundle, specs)
}

export function _cloneUnitBundle(
  Bundle: UnitBundle,
  bundle: UnitBundleSpec,
  specs: Specs
): UnitBundle {
  const NewClass = cloneUnitClass(Bundle)

  const NewBundle = bundleClass(NewClass, bundle, specs)

  return NewBundle
}

export function cloneUnitClass(Class: UnitClass): UnitClass {
  class NewClass extends Class {}

  Object.defineProperty(NewClass, 'name', { value: Class.constructor.name })

  return NewClass
}
