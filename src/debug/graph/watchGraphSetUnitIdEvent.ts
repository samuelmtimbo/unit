import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphSetUnitIdMomentData {
  unitId: string
  newUnitId: string
  name: string
  specId: string
  path: string[]
}

export interface GraphSetUnitIdMoment
  extends Moment<GraphSetUnitIdMomentData> {}

export function watchGraphSetUnitIdEvent(
  event: 'set_unit_id',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    unitId: string,
    newUnitId: string,
    name: string,
    specId: string,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        newUnitId,
        name,
        specId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
