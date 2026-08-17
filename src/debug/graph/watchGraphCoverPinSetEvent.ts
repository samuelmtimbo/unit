import { Graph } from '../../Class/Graph'
import { GraphCoverPinSetData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphCoverPinSetMomentData extends GraphCoverPinSetData {
  data: string
}

export interface GraphCoverPinSetMoment
  extends GraphMoment<GraphCoverPinSetMomentData> {}

export function extractCoverPinSetEventData(
  ...[type, pinId, pinSpec, data, path]: G_EE['cover_pin_set']
): GraphCoverPinSetMoment['data'] {
  return {
    type,
    pinId,
    pinSpec,
    data,
    path,
  }
}

export function stringifyCoverPinSetEventData(
  data: GraphCoverPinSetMoment['data']
) {
  return data
}

export function watchGraphCoverPinSetEvent(
  event: 'cover_pin_set',
  graph: Graph,
  callback: (moment: GraphCoverPinSetMoment) => void
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
