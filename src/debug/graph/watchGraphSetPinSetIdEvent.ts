import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetPinSetMomentData {
  type: IO
  pinId: string
  nextPinId: string
  path: string[]
}

export interface GraphSetPinSetMoment
  extends Moment<GraphSetPinSetMomentData> {}

export function watchGraphSetPinSetId(
  event: 'set_pin_set_id',
  graph: Graph,
  callback: (moment: GraphSetPinSetMoment) => void
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
