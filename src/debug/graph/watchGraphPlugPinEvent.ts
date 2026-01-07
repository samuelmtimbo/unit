import { Graph } from '../../Class/Graph'
import { GraphPlugPinData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphPlugPinMomentData extends GraphPlugPinData {
  path: string[]
}

export interface GraphPlugPinMoment extends Moment<GraphPlugPinMomentData> {}

export function extractPlugPinEventData(
  ...[type, pinId, subPinId, subPinSpec, path]: G_EE['plug_pin']
): GraphPlugPinMomentData {
  return {
    type,
    pinId,
    subPinId,
    subPinSpec,
    path,
  }
}

export function stringifyPlugPinEventData(data: GraphPlugPinMomentData) {
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
