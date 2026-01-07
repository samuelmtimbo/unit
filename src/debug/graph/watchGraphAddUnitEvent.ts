import { Graph } from '../../Class/Graph'
import { GraphAddUnitData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphAddUnitMomentData extends GraphAddUnitData {
  path: string[]
}

export interface GraphAddUnitMoment extends Moment<GraphAddUnitMomentData> {}

export function extractAddUnitEventData(
  ...[unitId, bundle, unit, path]: G_EE['add_unit']
): any {
  return {
    unitId,
    bundle,
    path,
  }
}

export function stringifyAddUnitEventData(data: GraphAddUnitData): any {
  return data
}

export function watchGraphAddUnitEvent(
  event: 'add_unit',
  graph: Graph,
  callback: (moment: GraphAddUnitMoment) => void
): () => void {
  const listener = (...args: G_EE['add_unit']) => {
    const data = stringifyAddUnitEventData(extractAddUnitEventData(...args))

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
