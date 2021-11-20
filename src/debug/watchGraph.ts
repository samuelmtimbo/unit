import { callAllDict } from '../callAll'
import { Unit } from '../Class/Unit'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { getMergePinNodeId } from '../spec/util'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { GraphUnitPinMoment } from './GraphUnitPinMoment'
import { Moment } from './Moment'
import { watchPin } from './watchPin'
import { watchUnitIO } from './watchUnitIO'

export function watchGraph<T extends G>(
  graph: T,
  callback: (moment: any) => void,
  events: string[] = DEFAULT_EVENTS
): Unlisten {
  const _unit_unlisten: Dict<Unlisten> = {}
  const _merge_unlisten: Dict<Unlisten> = {}

  const _watchUnit = (unit: Unit, unitId: string) => {
    const unlisten = watchUnitIO(
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

    _unit_unlisten[unitId] = unlisten
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

  const addUnitListener = (id, unit) => {
    _watchUnit(unit, id)
  }

  const addMergeListener = (id, mergeSpec, merge) => {
    _watchMerge(merge, id)
  }

  const removeUnitListener = (unitId: string) => {
    const unlisten = _unit_unlisten[unitId]
    unlisten()
    delete _unit_unlisten[unitId]
  }

  const removeMergeListener = (mergeId: string) => {
    const unlisten = _merge_unlisten[mergeId]
    unlisten()
    delete _merge_unlisten[mergeId]
  }

  const units = graph.refUnits()
  const merges = graph.refMerges()

  forEachKeyValue(units, _watchUnit)
  forEachKeyValue(merges, _watchMerge)

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
