import { Graph } from '../../Class/Graph'
import { GraphPlugPinData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphPlugPinMomentData extends GraphPlugPinData {}

export interface GraphPlugPinMoment
  extends GraphMoment<GraphPlugPinMomentData> {}

export function extractPlugPinEventData(
  ...[type, pinId, subPinId, subPinSpec, path]: G_EE['plug_pin']
): GraphPlugPinMoment['data'] {
  return {
    type,
    pinId,
    subPinId,
    subPinSpec,
    path,
  }
}

export function stringifyPlugPinEventData(data: GraphPlugPinMoment['data']) {
  return data
}

export function watchGraphPlugPinEvent(
  event: 'plug_pin',
  graph: Graph,
  callback: (moment: GraphPlugPinMoment) => void
): () => void {
  const listener = (...args: G_EE['plug_pin']) => {
    const data = stringifyPlugPinEventData(extractPlugPinEventData(...args))

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
