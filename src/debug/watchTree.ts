import callAll from '../callAll'
import { Graph } from '../Class/Graph'
import { U } from '../interface/U'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { Unlisten } from '../Unlisten'
import { Moment } from './Moment'
import { watchUnit } from './watchUnit'

export const watchTree = (
  unit: U,
  events: string[],
  callback: (path: string[], moment: Moment) => void
): (() => void) => {
  return _watchTree(unit, callback, [], events)
}

const _watchTree = (
  unit: U,
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
    forEachKeyValue(unit.refUnits(), (unit, id: string) => {
      const p = [...path, id]
      all.push(_watchTree(unit, callback, p, events))
    })
  }
  return callAll(all)
}
