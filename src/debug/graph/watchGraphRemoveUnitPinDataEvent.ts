import { Graph } from '../../Class/Graph'
import { GraphRemoveUnitPinDataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphRemoveUnitPinDataMomentData
  extends GraphRemoveUnitPinDataData {}

export interface GraphRemoveUnitPinDataMoment
  extends GraphMoment<GraphRemoveUnitPinDataMomentData> {}

export function extractRemoveUnitPinDataEventData(
  ...[unitId, type, pinId, data, path]: G_EE['remove_unit_pin_data']
): GraphRemoveUnitPinDataMoment['data'] {
  return {
    unitId,
    type,
    pinId,
    data,
    path,
  }
}

export function stringifyRemoveUnitPinDataEventData(
  data: GraphRemoveUnitPinDataMoment['data']
) {
  return data
}

export function watchGraphRemoveUnitPinData(
  event: 'remove_unit_pin_data',
  graph: Graph,
  callback: (moment: GraphRemoveUnitPinDataMoment) => void
): () => void {
  const listener = (...args: G_EE['remove_unit_pin_data']) => {
    const data = stringifyRemoveUnitPinDataEventData(
      extractRemoveUnitPinDataEventData(...args)
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
