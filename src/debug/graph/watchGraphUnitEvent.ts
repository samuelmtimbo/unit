import { Graph } from '../../Class/Graph'
import { Unit } from '../../Class/Unit'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Moment } from './../Moment'

export interface GraphAddUnitMomentData {
  unitId: string
  bundle: UnitBundleSpec
  path: string[]
}

export interface GraphAddUnitMoment extends Moment<GraphAddUnitMomentData> {}

export function watchGraphUnitEvent(
  event: 'add_unit' | 'remove_unit',
  graph: Graph,
  callback: (moment: GraphAddUnitMoment) => void
): () => void {
  const listener = (unitId: string, unit: Unit, path: string[]) => {
    const bundle = unit.getBundle()

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

export interface GraphSpecCloneUnitMomentData {
  unitId: string
  newUnitId: string
  path: string[]
}

export interface GraphSpecCloneUnitMoment
  extends Moment<GraphSpecCloneUnitMomentData> {}

export function watchGraphUnitCloneEvent(
  event: 'clone_unit',
  graph: Graph,
  callback: (moment: GraphSpecCloneUnitMoment) => void
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
