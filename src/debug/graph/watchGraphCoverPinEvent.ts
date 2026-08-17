import { Graph } from '../../Class/Graph'
import { GraphCoverPinData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphCoverPinEventData extends GraphCoverPinData {
  path: string[]
}

export interface GraphCoverPinEvent
  extends GraphMoment<GraphCoverPinEventData> {}

export function extractCoverPinEventData(
  ...[type, pinId, subPinId, subPinSpec, path]: G_EE['cover_pin']
): GraphCoverPinEvent['data'] {
  return {
    type,
    pinId,
    subPinId,
    subPinSpec,
    path,
  }
}

export function stringifyCoverPinEventData(data: GraphCoverPinEvent['data']) {
  return data
}

export function watchGraphCoverPinEvent(
  event: 'cover_pin',
  graph: Graph,
  callback: (moment: GraphCoverPinEvent) => void
): () => void {
  const listener = (...args: G_EE['cover_pin']) => {
    const data = stringifyCoverPinEventData(extractCoverPinEventData(...args))

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
