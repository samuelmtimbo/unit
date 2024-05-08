import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetPinSetIdMomentData {
  type: IO
  pinId: string
  nextPinId: string
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
