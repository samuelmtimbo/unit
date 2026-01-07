import { Graph } from '../../Class/Graph'
import { GraphRemoveUnitPinDataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphRemoveUnitPinDataMomentData
  extends GraphRemoveUnitPinDataData {
  path: string[]
}

export interface GraphRemoveUnitPinDataMoment
  extends Moment<GraphRemoveUnitPinDataMomentData> {}

export function extractRemoveUnitPinDataEventData(
  ...[unitId, type, pinId, data, path]: G_EE['remove_unit_pin_data']
): GraphRemoveUnitPinDataMomentData {
  return {
    unitId,
    type,
    pinId,
    data,
    path,
  }
}

export function stringifyRemoveUnitPinDataEventData(
  data: GraphRemoveUnitPinDataMomentData
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
