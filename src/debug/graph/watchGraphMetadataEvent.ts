import { Graph } from '../../Class/Graph'
import { GraphSetMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetMetadataMomentData extends GraphSetMetadataData {}

export interface GraphSetMetadataMoment
  extends GraphMoment<GraphSetMetadataMomentData> {}

export function extractSetMetadataEventData(
  ...[path_, value, path]: G_EE['set_metadata']
): GraphSetMetadataMoment['data'] {
  return {
    path_,
    value,
    path,
  }
}

export function stringifySetMetadataEventData(
  data: GraphSetMetadataMomentData
) {
  return data
}

export function watchGraphSetMetadataEvent(
  event: 'set_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (...args: G_EE['set_metadata']) => {
    const data = stringifySetMetadataEventData(
      extractSetMetadataEventData(...args)
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
