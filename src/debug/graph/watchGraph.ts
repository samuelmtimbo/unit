import { Graph } from '../../Class/Graph'
import { Unit } from '../../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../../constant/GRAPH_DEFAULT_EVENTS'
import { getMergePinNodeId } from '../../spec/util/spec'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'
import { callAllDict } from '../../util/call/callAllDict'
import { GraphMoment } from '../GraphMoment'
import { GraphUnitMoment } from '../GraphUnitMoment'
import { GraphUnitPinMoment } from '../GraphUnitPinMoment'
import { watchGraphUnit } from '../watchGraphUnit'
import { watchPin } from '../watchPin'
import { watchUnitIO } from '../watchUnitIO'

export function watchGraph<T extends Graph>(
  graph: T,
  callback: (moment: GraphMoment) => void,
  events: string[] = GRAPH_DEFAULT_EVENTS
): Unlisten {
  const _unit_unlisten: Dict<Unlisten> = {}
  const _merge_unlisten: Dict<Unlisten> = {}

  const _watchUnit = (unit: Unit, unitId: string) => {
    const unitIOUnlisten = watchUnitIO(
      unit,
      events,
      ({ type, event, data }: GraphUnitMoment<any>) => {
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
      ({ type, event, data }: GraphUnitMoment<any>) => {
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

  const _watchMerge = (merge: Unit<any>, mergeId: string) => {
    const mergeInputNodeId = getMergePinNodeId(mergeId, 'input')

    const input = merge.getInput(mergeInputNodeId)

    const unlisten = watchPin(input, ({ event, data }: GraphUnitPinMoment) => {
      callback({
        type: 'merge',
        event,
        data: {
          ...data,
          type: 'input',
          mergeId,
        },
      })
    })

    _merge_unlisten[mergeId] = unlisten
  }

  const addUnitListener = (id, unit, path) => {
    if (path.length === 0) {
      _watchUnit(unit, id)
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

  const units = graph.getUnits()
  const merges = graph.getMerges()

  forEachValueKey(units, _watchUnit)
  forEachValueKey(merges, _watchMerge)

  graph.addListener('before_add_unit', addUnitListener)
  graph.addListener('before_add_merge', addMergeListener)
  graph.addListener('before_remove_unit', removeUnitListener)
  graph.addListener('before_remove_merge', removeMergeListener)

  return () => {
    graph.removeListener('before_add_unit', addUnitListener)
    graph.removeListener('before_add_merge', addMergeListener)
    graph.removeListener('before_remove_unit', removeUnitListener)
    graph.removeListener('before_remove_merge', removeMergeListener)

    callAllDict(_unit_unlisten)()
    callAllDict(_merge_unlisten)()
  }
}
