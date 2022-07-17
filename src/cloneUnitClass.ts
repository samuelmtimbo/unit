import { bundleClass } from './spec/bundleClass'
import { UnitBundle } from './types/UnitBundle'
import { UnitClass } from './types/UnitClass'

export function cloneUnitBundle(Bundle: UnitBundle): UnitBundle {
  const { __bundle } = Bundle

  const NewClass = cloneUnitClass(Bundle)

  const NewBundle = bundleClass(NewClass, __bundle)

  return NewBundle
}

export function cloneUnitClass(Class: UnitClass): UnitClass {
  class NewClass extends Class {}

  Object.defineProperty(NewClass, 'name', { value: Class.constructor.name })

  return NewClass
}
