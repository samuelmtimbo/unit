import { U } from '../interface/U'
import { Moment } from './Moment'

export interface GraphSpecUnitMomentData {
  unitId: string
  specId: string
}

export interface GraphSpecUnitMoment extends Moment<GraphSpecUnitMomentData> {}

export function watchGraphUnitEvent(
  event: 'add_unit' | 'remove_unit',
  unit: U,
  callback: (moment: GraphSpecUnitMoment) => void
): () => void {
  const listener = (unitId: string, _unit: any) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        specId: _unit.constructor.id,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
