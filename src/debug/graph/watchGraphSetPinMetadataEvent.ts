import { Graph } from '../../Class/Graph'
import { GraphSetPinMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetPinMetadataMomentData extends GraphSetPinMetadataData {
  path_: string[]
  path: string[]
}

export interface GraphMetadataMoment
  extends Moment<GraphSetPinMetadataMomentData> {}

export function extractSetPinMetadataEventData(
  ...[type, pinId, path_, value, path]: G_EE['set_pin_metadata']
): GraphSetPinMetadataMomentData {
  return {
    type,
    pinId,
    path_,
    value,
    path,
  }
}

export function stringifySetPinMetadataEventData(
  data: GraphSetPinMetadataMomentData
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
