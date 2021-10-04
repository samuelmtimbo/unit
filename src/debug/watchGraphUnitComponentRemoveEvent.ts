import { U } from '../interface/U'
import { Moment } from './Moment'

export interface GraphSpecComponentRemoveMomentData {
  unitId: string
}

export interface GraphSpecComponentRemoveMoment
  extends Moment<GraphSpecComponentRemoveMomentData> {}

const event = 'component_remove'

export function watchGraphUnitComponentRemoveEvent(
  unit: U,
  callback: (moment: GraphSpecComponentRemoveMoment) => void
): () => void {
  const listener = (unitId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
