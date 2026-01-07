import { Graph } from '../../Class/Graph'
import { GraphExposePinSetData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphExposePinSetMomentData extends GraphExposePinSetData {
  data: string
  path: string[]
}

export interface GraphExposePinSetMoment
  extends Moment<GraphExposePinSetMomentData> {}

export function extractExposePinSetEventData(
  ...[type, pinId, pinSpec, data, path]: G_EE['expose_pin_set']
): GraphExposePinSetMomentData {
  return {
    type,
    pinId,
    pinSpec,
    data,
    path,
  }
}

export function stringifyExposePinSetEventData(
  data: GraphExposePinSetMomentData
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
