import { Graph } from '../../Class/Graph'
import { Moment } from './../Moment'

export interface GraphSpecUnitMomentData {
  unitId: string
  specId: string
}

export interface GraphSpecUnitMoment extends Moment<GraphSpecUnitMomentData> {}

export function watchGraphUnitEvent(
  event: 'add_unit' | 'remove_unit',
  graph: Graph,
  callback: (moment: GraphSpecUnitMoment) => void
): () => void {
  const listener = (unitId: string, _unit: any) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        specId: _unit.constructor.__bundle.unit.id,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}

export interface GraphSpecCloneUnitMomentData {
  unitId: string
  newUnitId: string
}

export interface GraphSpecCloneUnitMoment
  extends Moment<GraphSpecCloneUnitMomentData> {}

export function watchGraphUnitCloneEvent(
  event: 'clone_unit',
  graph: Graph,
  callback: (moment: GraphSpecCloneUnitMoment) => void
): () => void {
  const listener = (unitId: string, newUnitId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        newUnitId,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
