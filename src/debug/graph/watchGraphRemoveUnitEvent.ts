import { Graph } from '../../Class/Graph'
import { GraphAddUnitData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphRemoveUnitMomentData extends GraphAddUnitData {
  path: string[]
}

export interface GraphRemoveUnitMoment
  extends Moment<GraphRemoveUnitMomentData> {}

export function extractRemoveUnitEventData(
  ...[unitId, bundle, unit, path]: G_EE['remove_unit']
): GraphRemoveUnitMomentData {
  return {
    unitId,
    bundle,
    path,
  }
}

export function stringifyRemoveUnitEventData(data: GraphRemoveUnitMomentData) {
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
