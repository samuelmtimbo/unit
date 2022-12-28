import { Unit } from '../Class/Unit'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'
import { fromId } from './fromId'

export function unitFromBundleSpec(
  unitBundleSpec: UnitBundleSpec,
  branch: Dict<true> = {},
  system: System
): Unit {
  const {
    unit: { id, input, output },
    specs = {},
  } = unitBundleSpec

  const { classes } = system

  system.injectSpecs(specs)

  const Bundle = fromId(id, system.specs, classes, branch)

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
    unit.restore(memory)
  }

  forEachValueKey(input || {}, ({ data }, pinId: string) => {
    if (data !== undefined) {
      const input = unit.getInput(pinId)

      data = evaluate(data, system.specs, classes)

      input.push(data)
    }
  })

  return unit
}
