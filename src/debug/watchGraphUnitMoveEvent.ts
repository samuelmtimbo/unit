import { U } from '../interface/U'
import { Moment } from './Moment'

export interface GraphSpecUnitMoveMomentData {
  id: string
  unitId: string
  inputId: string
}

export interface GraphSpecUnitMoveMoment
  extends Moment<GraphSpecUnitMoveMomentData> {}

export function watchGraphUnitMoveEvent(
  event: 'move_unit',
  unit: U,
  callback: (moment: GraphSpecUnitMoveMoment) => void
): () => void {
  const listener = (id: string, unitId: string, inputId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        id,
        unitId,
        inputId,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
