import { Graph } from '../../Class/Graph'
import { GraphSetPinSetIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetPinSetIdMomentData extends GraphSetPinSetIdData {
  path: string[]
}

export interface GraphSetPinSetIdMoment
  extends Moment<GraphSetPinSetIdMomentData> {}

export function extractSetPinSetIdEventData(
  ...[type, pinId, newPinId, path]: G_EE['set_pin_set_id']
): GraphSetPinSetIdMomentData {
  return {
    type,
    pinId,
    newPinId,
    path,
  }
}

export function stringifySetPinSetIdEventData(
  data: GraphSetPinSetIdMomentData
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
