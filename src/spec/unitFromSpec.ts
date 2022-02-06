import { Unit } from '../Class/Unit'
import { Pod } from '../pod'
import { System } from '../system'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { GraphUnitSpec } from '../types'
import { Dict } from '../types/Dict'
import { fromId } from './fromId'

export function unitFromSpec(
  unitSpec: GraphUnitSpec,
  branch: Dict<true> = {},
  system: System,
  pod: Pod
): Unit {
  const { id, input, output } = unitSpec

  const { classes } = system

  const Class = fromId(id, { ...system.specs, ...pod.specs }, classes, branch)

  const unit = new Class(system, pod)

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
