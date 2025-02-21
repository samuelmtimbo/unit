import { Graph } from '../../Class/Graph'
import { GraphSetPinSetIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetPinSetIdMomentData extends GraphSetPinSetIdData {
  path: string[]
}

export interface GraphSetPinSetIdMoment
  extends Moment<GraphSetPinSetIdMomentData> {}

export function watchGraphSetPinSetId(
  event: 'set_pin_set_id',
  graph: Graph,
  callback: (moment: GraphSetPinSetIdMoment) => void
): () => void {
  const listener = (
    ...[type, pinId, nextPinId, path]: G_EE['set_pin_set_id']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        nextPinId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
