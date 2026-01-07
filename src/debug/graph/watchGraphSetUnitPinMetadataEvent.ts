import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitPinMetadataMomentData
  extends GraphSetUnitPinMetadataData {
  path: string[]
}

export interface GraphSetUnitPinMetadataMoment
  extends Moment<GraphSetUnitPinMetadataMomentData> {}

export function extractSetUnitPinMetadataEventData(
  ...[unitId, type, pinId, path_, value, path]: G_EE['set_unit_pin_metadata']
): GraphSetUnitPinMetadataMomentData {
  return {
    unitId,
    type,
    pinId,
    path_,
    value,
    path,
  }
}

export function stringifySetUnitPinMetadataEventData(
  data: GraphSetUnitPinMetadataMomentData
) {
  return data
}

export function watchGraphSetUnitPinMetadataEvent(
  event: 'set_unit_pin_metadata',
  graph: Graph,
  callback: (moment: GraphSetUnitPinMetadataMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_pin_metadata']) => {
    const data = stringifySetUnitPinMetadataEventData(
      extractSetUnitPinMetadataEventData(...args)
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
