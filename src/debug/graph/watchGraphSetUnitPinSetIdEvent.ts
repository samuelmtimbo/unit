import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinSetIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitPinSetIdMomentData
  extends GraphSetUnitPinSetIdData {
  path: string[]
}

export interface GraphSetUnitPinSetIdMoment
  extends Moment<GraphSetUnitPinSetIdMomentData> {}

export function watchGraphSetUnitPinSetId(
  event: 'set_unit_pin_set_id',
  graph: Graph,
  callback: (moment: GraphSetUnitPinSetIdMoment) => void
): () => void {
  const listener = (
    ...[unitId, type, pinId, newPinId, path]: G_EE['set_unit_pin_set_id']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        newPinId,
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
