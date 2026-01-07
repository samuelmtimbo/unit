import { Graph } from '../../Class/Graph'
import { GraphExposePinData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphExposePinEventData extends GraphExposePinData {
  path: string[]
}

export interface GraphExposePinEvent extends Moment<GraphExposePinEventData> {}

export function extractExposePinEventData(
  ...[type, pinId, subPinId, subPinSpec, path]: G_EE['expose_pin']
): GraphExposePinEventData {
  return {
    type,
    pinId,
    subPinId,
    subPinSpec,
    path,
  }
}

export function stringifyExposePinEventData(data: GraphExposePinEventData) {
  return data
}

export function watchGraphExposePinEvent(
  event: 'expose_pin',
  graph: Graph,
  callback: (moment: GraphExposePinEvent) => void
): () => void {
  const listener = (...args: G_EE['expose_pin']) => {
    const data = stringifyExposePinEventData(extractExposePinEventData(...args))

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
