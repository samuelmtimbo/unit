import { Graph } from '../../Class/Graph'
import { GraphSetUnitIdData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitIdMomentData extends GraphSetUnitIdData {
  path: string[]
}

export interface GraphSetUnitIdMoment
  extends Moment<GraphSetUnitIdMomentData> {}

export function extractSetUnitIdEventData(
  ...[unitId, newUnitId, name, specId, path]: G_EE['set_unit_id']
): GraphSetUnitIdMomentData {
  return {
    unitId,
    newUnitId,
    name,
    specId,
    path,
  }
}

export function stringifySetUnitIdEventData(data: GraphSetUnitIdMomentData) {
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
