import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinDataData } from '../../Class/Graph/interface'
import { stringify } from '../../spec/stringify'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetUnitPinDataMomentData
  extends GraphSetUnitPinDataData {}

export interface GraphSetUnitPinDataMoment
  extends GraphMoment<GraphSetUnitPinDataMomentData> {}

export function extractSetUnitPinDataEventData(
  ...[unitId, type, pinId, data, path]: G_EE['set_unit_pin_data']
): GraphSetUnitPinDataMoment['data'] {
  return {
    unitId,
    type,
    pinId,
    data,
    path,
  }
}

export function stringifySetUnitPinDataEventData(
  data: GraphSetUnitPinDataMoment['data']
) {
  return {
    ...data,
    data: stringify(data.data),
  }
}

export function watchGraphSetUnitPinData(
  event: 'set_unit_pin_data',
  graph: Graph,
  callback: (moment: GraphSetUnitPinDataMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_pin_data']) => {
    const data = stringifySetUnitPinDataEventData(
      extractSetUnitPinDataEventData(...args)
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
