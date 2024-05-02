import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { forEachObjVK } from '../util/object'

export const remapSpec = (spec: GraphSpec, specIdMap: Dict<string>): string => {
  const { id, units } = spec

  forEachObjVK(units, (unit, unitId) => {
    unit.id = specIdMap[unit.id] ?? unit.id
  })

  spec.id = specIdMap[id] ?? id

  return spec.id
}
