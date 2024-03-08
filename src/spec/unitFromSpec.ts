import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { io } from '../types/IOOf'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { weakMerge } from '../weakMerge'
import { evaluate } from './evaluate'
import { evaluateMemorySpec } from './evaluate/evaluateMemorySpec'
import { unitFromId } from './fromId'
import { applyUnitDefaultIgnored } from './fromSpec'

export function unitFromBundleSpec(
  system: System,
  bundle: UnitBundleSpec,
  specs: Specs,
  branch: Dict<true> = {}
): Unit {
  applyUnitDefaultIgnored(bundle.unit, weakMerge(specs, bundle.specs ?? {}))

  const {
    unit: { id, input },
  } = bundle

  const { classes } = system

  if (bundle.specs) {
    system.injectSpecs(bundle.specs)
  }

  const unit = unitFromId(system, id, specs, classes, branch)

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
    evaluateMemorySpec(memory, specs, classes)

    unit.restore(memory)
  }

  forEachValueKey(input || {}, (unitPinSpec, pinId: string) => {
    const { data } = unitPinSpec ?? {}

    if (data !== undefined) {
      const input = unit.getInput(pinId)

      const _data = evaluate(data, system.specs, classes)

      const isClass = _data instanceof Function

      if (isClass) {
        system.injectSpecs(_data.__bundle?.specs ?? {})
      }

      if (input.ref()) {
        if (isClass) {
          const __data = new _data(system)

          __data.play()

          input.push(__data)
        } else {
          //
        }
      } else {
        input.push(_data)
      }
    }
  })

  return unit
}
