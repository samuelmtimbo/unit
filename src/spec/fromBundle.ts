import { Pod } from '../pod'
import { System } from '../system'
import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'
import { Classes, Specs } from '../types'
import { UnitClass } from '../types/UnitClass'
import { bundleClass } from './bundleClass'
import { fromId } from './fromId'

export function fromBundle<I, O>(
  bundle: UnitBundleSpec,
  specs: Specs,
  classes: Classes
): UnitClass {
  const { unit: _unit, specs: _specs } = bundle

  const { id: _id, input = {} } = _unit

  const Class = fromId(_id, { ..._specs, ...specs }, classes, {})

  class _Class extends Class {
    constructor(system: System, pod: Pod) {
      super(system, pod)

      for (const inputId in input) {
        const data = input[inputId]
        this.push(inputId, data)
      }
    }
  }

  bundleClass(_Class, bundle)

  return _Class
}
