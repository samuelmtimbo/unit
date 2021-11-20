import { U } from '../interface/U'
import { System } from '../system'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { GraphUnitSpec } from '../types'
import { Dict } from '../types/Dict'
import { fromId } from './fromId'

export function unitFromSpec(
  unitSpec: GraphUnitSpec,
  branch: Dict<true> = {},
  system: System
): U {
  const { id, input, output } = unitSpec

  const { specs, classes } = system || { specs: {}, classes: {} }

  const Class = fromId(id, specs, classes, branch)

  const unit = new Class(system)

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
