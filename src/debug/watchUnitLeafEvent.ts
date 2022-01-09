import { Graph } from '../Class/Graph'
import { Moment } from './Moment'

export interface UnitGraphSpecMomentData {
  path: string[]
  specId: string
}

export interface UnitGraphSpecMoment extends Moment<UnitGraphSpecMomentData> {
  type: 'unit'
  event: 'leaf_add_unit' | 'leaf_remove_unit'
}

export function watchUnitLeafEvent(
  event: 'leaf_add_unit' | 'leaf_remove_unit',
  unit: Graph,
  callback: (moment) => void
): () => void {
  const listener = (_unit: any, path: string[]) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
        specId: _unit.constructor.__bundle.unit.id,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
