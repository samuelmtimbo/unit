import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinSetIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitPinSetIdMomentData
  extends GraphSetUnitPinSetIdData {
  path: string[]
}

export interface GraphSetUnitPinSetIdMoment
  extends Moment<GraphSetUnitPinSetIdMomentData> {}

export function extractSetUnitPinSetIdEventData(
  ...[unitId, type, pinId, newPinId, path]: G_EE['set_unit_pin_set_id']
): GraphSetUnitPinSetIdMomentData {
  return {
    unitId,
    type,
    pinId,
    newPinId,
    path,
  }
}

export function stringifySetUnitPinSetIdEventData(
  data: GraphSetUnitPinSetIdMomentData
) {
  return data
}

export function watchGraphSetUnitPinSetId(
  event: 'set_unit_pin_set_id',
  graph: Graph,
  callback: (moment: GraphSetUnitPinSetIdMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_pin_set_id']) => {
    const data = stringifySetUnitPinSetIdEventData(
      extractSetUnitPinSetIdEventData(...args)
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
