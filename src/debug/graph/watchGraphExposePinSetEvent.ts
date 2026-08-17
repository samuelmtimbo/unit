import { Graph } from '../../Class/Graph'
import { GraphExposePinSetData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphExposePinSetMomentData extends GraphExposePinSetData {
  data: string
}

export interface GraphExposePinSetMoment
  extends GraphMoment<GraphExposePinSetMomentData> {}

export function extractExposePinSetEventData(
  ...[type, pinId, pinSpec, data, path]: G_EE['expose_pin_set']
): GraphExposePinSetMoment['data'] {
  return {
    type,
    pinId,
    pinSpec,
    data,
    path,
  }
}

export function stringifyExposePinSetEventData(
  data: GraphExposePinSetMoment['data']
) {
  return data
}

export function watchGraphExposePinSetEvent(
  event: 'expose_pin_set',
  graph: Graph,
  callback: (moment: GraphExposePinSetMoment) => void
): () => void {
  const listener = (...args: G_EE['expose_pin_set']) => {
    const data = stringifyExposePinSetEventData(
      extractExposePinSetEventData(...args)
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
