import { Config } from '../Class/Unit/Config'
import { U } from '../interface/U'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { GraphUnitSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { fromId } from './fromId'

export function unitFromSpec(
  unitSpec: GraphUnitSpec,
  config: Config = {},
  specs: Specs = {},
  branch: Dict<true> = {}
): U {
  const { path, catchErr, input, output, state } = unitSpec

  const Class = fromId(path, specs, branch)

  const unit = new Class({
    catchErr,
    state,
    ...config,
  })

  forEachKeyValue(input || {}, ({ constant, data }, pinId: string) => {
    const input = unit.getInput(pinId)
    if (constant !== undefined && constant !== null) {
      unit.setInputConstant(pinId, constant)
    }
    // if (data !== undefined) {
    //   data = evaluate(data)
    //   input.push(data)
    // }
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
