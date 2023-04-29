import { bundleClass } from './spec/bundleClass'
import { UnitBundle } from './types/UnitBundle'
import { UnitClass } from './types/UnitClass'
import { clone } from './util/object'

export function cloneUnitBundle(Bundle: UnitBundle): UnitBundle {
  const { __bundle } = Bundle

  const bundle = clone(__bundle)

  const NewClass = cloneUnitClass(Bundle)

  const NewBundle = bundleClass(NewClass, bundle)

  return NewBundle
}

export function cloneUnitClass(Class: UnitClass): UnitClass {
  class NewClass extends Class {}

  Object.defineProperty(NewClass, 'name', { value: Class.constructor.name })

  return NewClass
}
