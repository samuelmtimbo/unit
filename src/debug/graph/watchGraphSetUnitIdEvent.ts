import { Graph } from '../../Class/Graph'
import { GraphSetUnitIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetUnitIdMomentData extends GraphSetUnitIdData {}

export interface GraphSetUnitIdMoment
  extends GraphMoment<GraphSetUnitIdMomentData> {}

export function extractSetUnitIdEventData(
  ...[unitId, newUnitId, name, specId, path]: G_EE['set_unit_id']
): GraphSetUnitIdMoment['data'] {
  return {
    unitId,
    newUnitId,
    name,
    specId,
    path,
  }
}

export function stringifySetUnitIdEventData(
  data: GraphSetUnitIdMoment['data']
) {
  return data
}

export function watchGraphSetUnitIdEvent(
  event: 'set_unit_id',
  graph: Graph,
  callback: (moment: GraphSetUnitIdMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_id']) => {
    const data = stringifySetUnitIdEventData(extractSetUnitIdEventData(...args))

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
