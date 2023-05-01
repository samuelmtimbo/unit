import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'
import { fromId } from './fromId'
import { evaluateMemorySpec } from './stringifySpec'

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

  forEachValueKey(input || {}, ({ constant }, pinId: string) => {
    if (constant !== undefined && constant !== null) {
      unit.setInputConstant(pinId, constant)
    }
  })
  forEachValueKey(input || {}, ({ ignored }, pinId: string) => {
    if (typeof ignored === 'boolean') {
      unit.setInputIgnored(pinId, ignored)
    }
  })
  forEachValueKey(output || {}, ({ ignored }, pinId: string) => {
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

      if (_data instanceof Function) {
        system.injectSpecs(_data.__bundle?.specs ?? {})
      }

      if (input.ref()) {
        const __data = new _data(system)

        __data.play()

        input.push(__data)
      } else {
        input.push(_data)
      }
    }
  })

  return unit
}
