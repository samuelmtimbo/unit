import { U } from '../interface/U'
import { GraphUnitSpec } from '../types'
import { Moment } from './Moment'

export interface GraphSpecComponentAppendMomentData {
  unitId: string
  unitSpec: GraphUnitSpec
}

export interface GraphSpecComponentAppendMoment
  extends Moment<GraphSpecComponentAppendMomentData> {}

const event = 'component_append'

export function watchGraphUnitComponentAppendEvent(
  unit: U,
  callback: (moment: GraphSpecComponentAppendMoment) => void
): () => void {
  const listener = (unitId: string, unitSpec: any) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        unitSpec,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
