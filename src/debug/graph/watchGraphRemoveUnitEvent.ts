import { Graph } from '../../Class/Graph'
import { GraphAddUnitData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphUnitMoment } from '../GraphUnitMoment'

export interface GraphRemoveUnitMomentData extends GraphAddUnitData {}

export interface GraphRemoveUnitMoment
  extends GraphUnitMoment<GraphRemoveUnitMomentData> {}

export function extractRemoveUnitEventData(
  ...[unitId, bundle, unit, path]: G_EE['remove_unit']
): GraphRemoveUnitMoment['data'] {
  return {
    unitId,
    bundle,
    path,
  }
}

export function stringifyRemoveUnitEventData(
  data: GraphRemoveUnitMoment['data']
) {
  return data
}

export function watchGraphRemoveUnitEvent(
  event: 'remove_unit',
  graph: Graph,
  callback: (moment: GraphRemoveUnitMoment) => void
): () => void {
  const listener = (...args: G_EE['remove_unit']) => {
    const data = stringifyRemoveUnitEventData(
      extractRemoveUnitEventData(...args)
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

export interface GraphCloneUnitMomentData {
  unitId: string
  newUnitId: string
  path: string[]
}
