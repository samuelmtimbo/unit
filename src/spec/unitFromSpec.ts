import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'
import { evaluateMemorySpec } from './evaluateSpec'
import { fromId } from './fromId'

export function unitFromBundleSpec(
  system: System,
  unitBundleSpec: UnitBundleSpec,
  specs: Specs,
  branch: Dict<true> = {}
): Unit {
  const {
    unit: { id, input, output },
  } = unitBundleSpec

  const { classes } = system

  if (unitBundleSpec.specs) {
    // injectSpecs(specs, unitBundleSpec.specs)
    system.injectSpecs(unitBundleSpec.specs)
  }

  const Bundle = fromId(id, specs, classes, branch)

  const unit = new Bundle(system)

  forEachValueKey(input || {}, (pinSpec = {}, pinId: string) => {
    const { constant, ignored } = pinSpec

    if (constant !== undefined && constant !== null) {
      unit.setInputConstant(pinId, constant)
    }

    if (typeof ignored === 'boolean') {
      unit.setInputIgnored(pinId, ignored)
    }
  })
  forEachValueKey(output || {}, (pinSpec = {}, pinId: string) => {
    const { ignored } = pinSpec

    if (typeof ignored === 'boolean') {
      unit.setOutputIgnored(pinId, ignored)
    }
  })

  const {
    unit: { memory },
  } = unitBundleSpec

  if (memory) {
    evaluateMemorySpec(memory, specs, classes)

    unit.restore(memory)
  }

  forEachValueKey(input || {}, ({ data }, pinId: string) => {
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
