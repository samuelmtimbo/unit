import { Graph } from '../../Class/Graph'
import { Unit } from '../../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../../constant/GRAPH_DEFAULT_EVENTS'
import { getMergePinNodeId } from '../../spec/util'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { U } from '../../types/interface/U'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'
import { callAllDict } from '../../util/call/callAllDict'
import { GraphUnitPinMoment } from '../GraphUnitPinMoment'
import { Moment } from '../Moment'
import { watchGraphUnit } from '../watchGraphUnit'
import { watchPin } from '../watchPin'
import { watchUnitIO } from '../watchUnitIO'

export function watchGraph<T extends Graph>(
  graph: T,
  callback: (moment: any) => void,
  events: string[] = GRAPH_DEFAULT_EVENTS
): Unlisten {
  const _unit_unlisten: Dict<Unlisten> = {}
  const _merge_unlisten: Dict<Unlisten> = {}

  const _watchUnit = (unit: Unit, unitId: string) => {
    const unitIOUnlisten = watchUnitIO(
      unit,
      events,
      ({ type, event, data }: Moment<any>) => {
        callback({
          type,
          event,
          data: {
            ...data,
            unitId,
          },
        } as GraphUnitPinMoment)
      }
    )

    // if (unit instanceof Graph) {
    const unitGraphUnlisten = watchGraphUnit(
      unit,
      events,
      ({ type, event, data }: Moment<any>) => {
        callback({
          type,
          event,
          data: {
            ...data,
            unitId,
          },
        } as GraphUnitPinMoment)
      }
    )
    // }

    _unit_unlisten[unitId] = callAll([unitIOUnlisten, unitGraphUnlisten])
  }

  const _watchMerge = (merge: U<any>, mergeId: string) => {
    const mergeInputNodeId = getMergePinNodeId(mergeId, 'input')
    const input = merge.getInput(mergeInputNodeId)

    const unlisten = watchPin(
      'merge',
      mergeId,
      input,
      ({ type, event, data }: Moment) => {
        callback({
          type,
          event,
          data: {
            ...data,
            mergeId,
          },
        })
      }
    )

    _merge_unlisten[mergeId] = unlisten
  }

  const addUnitListener = (id, unit, path) => {
    if (path.length === 0) {
      _watchUnit(unit, id)
    }
  }

  const cloneUnitListener = (id, newUnitId, newUnit, path) => {
    if (path.length === 0) {
      _watchUnit(newUnit, newUnitId)
    }
  }

  const addMergeListener = (id, mergeSpec, merge, path) => {
    if (path.length === 0) {
      _watchMerge(merge, id)
    }
  }

  const removeUnitListener = (unitId: string, unit: Unit, path: string[]) => {
    if (path.length === 0) {
      const unlisten = _unit_unlisten[unitId]

      unlisten()

      delete _unit_unlisten[unitId]
    }
  }

  const removeMergeListener = (
    mergeId: string,
    mergeSpec,
    merge,
    path: string[]
  ) => {
    if (path.length === 0) {
      const unlisten = _merge_unlisten[mergeId]

      unlisten()

      delete _merge_unlisten[mergeId]
    }
  }

  const units = graph.refUnits()
  const merges = graph.refMerges()

  forEachValueKey(units, _watchUnit)
  forEachValueKey(merges, _watchMerge)

  graph.addListener('before_add_unit', addUnitListener)
  graph.addListener('clone_unit', cloneUnitListener)
  graph.addListener('before_add_merge', addMergeListener)
  graph.addListener('before_remove_unit', removeUnitListener)
  graph.addListener('before_remove_merge', removeMergeListener)

  return () => {
    graph.removeListener('before_add_unit', addUnitListener)
    graph.removeListener('clone_unit', cloneUnitListener)
    graph.removeListener('before_add_merge', addMergeListener)
    graph.removeListener('before_remove_unit', removeUnitListener)
    graph.removeListener('before_remove_merge', removeMergeListener)

    callAllDict(_unit_unlisten)()
    callAllDict(_merge_unlisten)()
  }
}
