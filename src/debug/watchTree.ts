import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { Moment } from './Moment'
import { watchUnit } from './watchUnit'

export const watchTree = (
  unit: Unit | Graph,
  events: string[],
  callback: (path: string[], moment: Moment) => void
): (() => void) => {
  return _watchTree(unit, callback, [], events)
}

const _watchTree = (
  unit: Unit | Graph,
  callback: (path: string[], moment: Moment) => void,
  path: string[] = [],
  events: string[]
): (() => void) => {
  const all: Unlisten[] = []
  all.push(
    watchUnit(
      unit,
      (moment: Moment) => {
        callback(path, moment)
      },
      events
    )
  )
  if (unit instanceof Graph) {
    forEachValueKey(unit.refUnits(), (unit, id: string) => {
      const p = [...path, id]
      all.push(_watchTree(unit, callback, p, events))
    })
  }
  return callAll(all)
}
