import { Graph } from '../../Class/Graph'
import { GraphSetUnitMetadataData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetUnitMetadataMomentData
  extends GraphSetUnitMetadataData {}

export interface GraphSetUnitMetadataMoment
  extends GraphMoment<GraphSetUnitMetadataMomentData> {}

export function extractSetUnitMetadataEventData(
  ...[unitId, path_, value, path]: G_EE['set_unit_metadata']
): GraphSetUnitMetadataMoment['data'] {
  return {
    unitId,
    path_,
    value,
    path,
  }
}

export function stringifySetUnitMetadataEventData(
  data: GraphSetUnitMetadataMoment['data']
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
