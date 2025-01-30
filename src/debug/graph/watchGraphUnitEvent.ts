import { Graph } from '../../Class/Graph'
import { GraphAddUnitData } from '../../Class/Graph/interface'
import { Unit } from '../../Class/Unit'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Moment } from './../Moment'

export interface GraphAddUnitMomentData extends GraphAddUnitData {
  path: string[]
}

export interface GraphAddUnitMoment extends Moment<GraphAddUnitMomentData> {}

export function watchGraphUnitEvent(
  event: 'add_unit' | 'remove_unit',
  graph: Graph,
  callback: (moment: GraphAddUnitMoment) => void
): () => void {
  const listener = (
    unitId: string,
    bundle: UnitBundleSpec,
    unit: Unit,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        bundle,
        path,
      },
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

export interface GraphCloneUnitMoment
  extends Moment<GraphCloneUnitMomentData> {}

export function watchGraphCloneUnitEvent(
  event: 'clone_unit',
  graph: Graph,
  callback: (moment: GraphCloneUnitMoment) => void
): () => void {
  const listener = (
    unitId: string,
    newUnitId: string,
    unit: Unit,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        newUnitId,
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
