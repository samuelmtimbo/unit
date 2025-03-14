import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'
import { io } from '../types/IOOf'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { clone } from '../util/clone'
import { weakMerge } from '../weakMerge'
import { evaluateDataValue } from './evaluateDataValue'
import { unitFromId } from './fromId'
import { applyUnitDefaultIgnored } from './fromSpec'
import { remapSpecs } from './remapBundle'
import { resolveDataRef } from './resolveDataValue'

export function unitFromBundleSpec<I, O>(
  system: System,
  bundle: UnitBundleSpec,
  specs: Specs,
  push: boolean,
  branch: Dict<true>
): Unit {
  const specs_ = weakMerge(specs, bundle.specs ?? {})

  applyUnitDefaultIgnored(bundle.unit, specs_)

  const {
    unit: { id, input },
  } = bundle

  const { classes } = system

  const spec_map_id = system.injectSpecs(bundle.specs ?? {})

  remapSpecs(bundle, spec_map_id)

  const unit = unitFromId<I, O>(system, id, specs_, classes, branch, push)

  io((type: IO) => {
    const pins = bundle.unit[type as IO] ?? {}

    forEachValueKey(pins, (pinSpec = {}, pinId: string) => {
      const { constant, ignored } = pinSpec

      if (typeof constant === 'boolean') {
        unit.setPinConstant(type, pinId as keyof I | keyof O, constant)
      }

      if (typeof ignored === 'boolean') {
        unit.setPinIgnored(type, pinId as keyof I | keyof O, ignored)
      }
    })
  })

  const {
    unit: { memory },
  } = bundle

  if (memory) {
    const memory_ = clone(memory)

    unit.restore(memory_)
  }

  if (push) {
    forEachValueKey(input || {}, (unitPinSpec, pinId) => {
      const { data } = unitPinSpec ?? {}

      const dataRef = evaluateDataValue(data, specs, classes)

      if (dataRef.data !== undefined) {
        const input = unit.getInput(pinId as any)

        const data_ = resolveDataRef(dataRef, specs, classes)

        if (!memory) {
          input.push(data_)
        }
      }
    })
  }

  return unit
}
