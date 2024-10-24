import { bundleClass } from './spec/bundleClass'
import { UnitBundle } from './types/UnitBundle'
import { UnitBundleSpec } from './types/UnitBundleSpec'
import { UnitClass } from './types/UnitClass'
import { clone } from './util/clone'

export function cloneUnitBundle(Bundle: UnitBundle): UnitBundle {
  const { __bundle } = Bundle

  const bundle = clone(__bundle)

  return _cloneUnitBundle(Bundle, bundle)
}

export function _cloneUnitBundle(
  Bundle: UnitBundle,
  bundle: UnitBundleSpec
): UnitBundle {
  const NewClass = cloneUnitClass(Bundle)

  const NewBundle = bundleClass(NewClass, bundle)

  return NewBundle
}

export function cloneUnitClass(Class: UnitClass): UnitClass {
  class NewClass extends Class {}

  Object.defineProperty(NewClass, 'name', { value: Class.constructor.name })

  return NewClass
}
