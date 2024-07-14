import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { io } from '../types/IOOf'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { clone } from '../util/object'
import { weakMerge } from '../weakMerge'
import { evaluateMemorySpec } from './evaluate/evaluateMemorySpec'
import { evaluateDataValue } from './evaluateDataValue'
import { unitFromId } from './fromId'
import { applyUnitDefaultIgnored } from './fromSpec'
import { resolveDataRef } from './resolveDataValue'

export function unitFromBundleSpec(
  system: System,
  bundle: UnitBundleSpec,
  specs: Specs,
  branch: Dict<true> = {}
): Unit {
  const specs_ = weakMerge(specs, bundle.specs ?? {})

  applyUnitDefaultIgnored(bundle.unit, specs_)

  const {
    unit: { id, input },
  } = bundle

  const { classes } = system

  if (bundle.specs) {
    system.injectSpecs(bundle.specs)
  }

  const unit = unitFromId(system, id, specs_, classes, branch)

  io((type) => {
    const pins = bundle.unit[type] ?? {}

    forEachValueKey(pins, (pinSpec = {}, pinId: string) => {
      const { constant, ignored } = pinSpec

      if (typeof constant === 'boolean') {
        unit.setPinConstant(type, pinId, constant)
      }

      if (typeof ignored === 'boolean') {
        unit.setPinIgnored(type, pinId, ignored)
      }
    })
  })

  const {
    unit: { memory },
  } = bundle

  if (memory) {
    const memory_ = clone(memory)

    evaluateMemorySpec(memory_, specs, classes)

    unit.restore(memory_)
  }

  forEachValueKey(input || {}, (unitPinSpec, pinId: string) => {
    const { data } = unitPinSpec ?? {}

    if (data !== undefined) {
      const input = unit.getInput(pinId)

      const dataRef = evaluateDataValue(data, specs, classes)

      let data_ = resolveDataRef(dataRef, specs, classes)

      if (input.ref()) {
        if (data_ instanceof Function) {
          data_ = new data_(system)

          data_.play()
        } else {
          //
        }
      }

      input.push(data_)
    }
  })

  return unit
}
