import { Unit } from '../Class/Unit'
import { Pod } from '../pod'
import { System } from '../system'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import isEqual from '../system/f/comparisson/Equals/f'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { fromId } from './fromId'

export function unitFromSpec(
  unitBundleSpec: UnitBundleSpec,
  branch: Dict<true> = {},
  system: System,
  pod: Pod
): Unit {
  const {
    unit: { id, input, output },
    specs = {},
  } = unitBundleSpec

  const { classes } = system

  for (const spec_id in specs) {
    const spec = specs[spec_id]
    const system_spec = system.specs[spec_id]
    const pod_spec = pod.specs[spec_id]

    if (system_spec) {
      if (!isEqual(system_spec, spec)) {
        // TODO
        // throw new Error('cannot inject duplicated spec id on system')
      }
    }

    if (pod_spec) {
      if (!isEqual(pod_spec, spec)) {
        // TODO
        // throw new Error('cannot inject duplicated spec id on pod')
      }
    }

    pod.specs[spec_id] = spec
  }

  const Bundle = fromId(id, { ...system.specs, ...pod.specs }, classes, branch)

  const unit = new Bundle(system, pod)

  unit._ = id

  forEachKeyValue(input || {}, ({ constant, data }, pinId: string) => {
    if (constant !== undefined && constant !== null) {
      unit.setInputConstant(pinId, constant)
    }
  })

  forEachKeyValue(input || {}, ({ ignored }, pinId: string) => {
    if (typeof ignored === 'boolean') {
      unit.setInputIgnored(pinId, ignored)
    }
  })

  forEachKeyValue(output || {}, ({ ignored }, pinId: string) => {
    if (typeof ignored === 'boolean') {
      unit.setOutputIgnored(pinId, ignored)
    }
  })

  return unit
}
