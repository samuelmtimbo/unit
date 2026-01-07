import { Graph } from '../../Class/Graph'
import { GraphSetUnitMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitMetadataMomentData
  extends GraphSetUnitMetadataData {
  path: string[]
}

export interface GraphSetUnitMetadataMoment
  extends Moment<GraphSetUnitMetadataMomentData> {}

export function extractSetUnitMetadataEventData(
  ...[unitId, path_, value, path]: G_EE['set_unit_metadata']
): GraphSetUnitMetadataMomentData {
  return {
    unitId,
    path_,
    value,
    path,
  }
}

export function stringifySetUnitMetadataEventData(
  data: GraphSetUnitMetadataMomentData
) {
  return data
}

export function watchGraphSetUnitMetadataEvent(
  event: 'set_unit_metadata',
  graph: Graph,
  callback: (moment: GraphSetUnitMetadataMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_metadata']) => {
    const data = stringifySetUnitMetadataEventData(
      extractSetUnitMetadataEventData(...args)
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
