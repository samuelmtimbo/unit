import { Pod } from './pod'
import { bundleClass } from './spec/bundleClass'
import { System } from './system'
import { UnitClass } from './types/UnitClass'

export function cloneUnitClass(unit: UnitClass): UnitClass {
  const { __bundle } = unit

  const NewClass = _cloneUnitClass(unit)

  bundleClass(NewClass, __bundle)

  return NewClass
}

export function _cloneUnitClass(unit: UnitClass): UnitClass {
  class NewClass extends unit {
    constructor(system: System, pod: Pod) {
      super(system, pod)
      // unit.constructor.call(this, system, pod)
    }
  }

  Object.defineProperty(NewClass, 'name', { value: unit.constructor.name })

  return NewClass
}
