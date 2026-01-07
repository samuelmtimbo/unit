import { Graph } from '../../Class/Graph'
import { GraphCoverPinSetData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphCoverPinSetMomentData extends GraphCoverPinSetData {
  data: string
  path: string[]
}

export interface GraphExposePinSetMoment
  extends Moment<GraphCoverPinSetMomentData> {}

export function extractCoverPinSetEventData(
  ...[type, pinId, pinSpec, data, path]: G_EE['cover_pin_set']
): GraphCoverPinSetMomentData {
  return {
    type,
    pinId,
    pinSpec,
    data,
    path,
  }
}

export function stringifyCoverPinSetEventData(
  data: GraphCoverPinSetMomentData
) {
  return data
}

export function watchGraphCoverPinSetEvent(
  event: 'cover_pin_set',
  graph: Graph,
  callback: (moment: GraphExposePinSetMoment) => void
): () => void {
  const listener = (...args: G_EE['cover_pin_set']) => {
    const data = stringifyCoverPinSetEventData(
      extractCoverPinSetEventData(...args)
    )

    callback({
      type: 'graph',
      event,
      data,
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
