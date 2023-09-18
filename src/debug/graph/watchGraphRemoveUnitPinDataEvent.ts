import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphRemoveUnitPinDataMomentData {
  unitId: string
  type: IO
  pinId: string
  path: string[]
}

export interface GraphRemoveUnitPinDataMoment
  extends Moment<GraphRemoveUnitPinDataMomentData> {}

export function watchGraphRemoveUnitPinData(
  event: 'remove_unit_pin_data',
  graph: Graph,
  callback: (moment: GraphRemoveUnitPinDataMoment) => void
): () => void {
  const listener = (
    ...[unitId, type, pinId, path]: G_EE['remove_unit_pin_data']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
