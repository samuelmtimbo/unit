import { Graph } from '../../Class/Graph'
import { GraphSetPinSetIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetPinSetIdMomentData extends GraphSetPinSetIdData {}

export interface GraphSetPinSetIdMoment
  extends GraphMoment<GraphSetPinSetIdMomentData> {}

export function extractSetPinSetIdEventData(
  ...[type, pinId, newPinId, pinSpec, path]: G_EE['set_pin_set_id']
): GraphSetPinSetIdMoment['data'] {
  return {
    type,
    pinId,
    newPinId,
    pinSpec,
    path,
  }
}

export function stringifySetPinSetIdEventData(
  data: GraphSetPinSetIdMoment['data']
) {
  return data
}

export function watchGraphSetPinSetId(
  event: 'set_pin_set_id',
  graph: Graph,
  callback: (moment: GraphSetPinSetIdMoment) => void
): () => void {
  const listener = (...args: G_EE['set_pin_set_id']) => {
    const data = stringifySetPinSetIdEventData(
      extractSetPinSetIdEventData(...args)
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
