import { Graph } from '../../Class/Graph'
import { GraphSetPinMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetPinMetadataMomentData extends GraphSetPinMetadataData {
  path_: string[]
}

export interface GraphSetPinMetadataMoment
  extends GraphMoment<GraphSetPinMetadataMomentData> {}

export function extractSetPinMetadataEventData(
  ...[type, pinId, path_, value, path]: G_EE['set_pin_metadata']
): GraphSetPinMetadataMoment['data'] {
  return {
    type,
    pinId,
    path_,
    value,
    path,
  }
}

export function stringifySetPinMetadataEventData(
  data: GraphSetPinMetadataMoment['data']
) {
  return data
}

export function watchGraphSetPinMetadataEvent(
  event: 'set_pin_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (...args: G_EE['set_pin_metadata']) => {
    const data = stringifySetPinMetadataEventData(
      extractSetPinMetadataEventData(...args)
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
