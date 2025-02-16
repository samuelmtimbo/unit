import { Graph } from '.'
import { ADD_UNIT, REMOVE_UNIT } from '../../spec/actions/G'
import { forEachPinOnMerge } from '../../spec/util/spec'
import { Dict } from '../../types/Dict'
import { UCG } from '../../types/interface/UCG'
import { deepGetOrDefault } from '../../util/object'
import { Unit } from '../Unit'
import { MoveMapping } from './buildMoveMap'
import { Moves } from './buildMoves'

export function moveSubgraph<T extends UCG<Dict<any>, Dict<any>, any>>(
  source: Graph<T>,
  target: Graph<T>,
  map: MoveMapping,
  moves: Moves
) {
  let units: Dict<Unit> = {}

  for (const move of moves) {
    if (move.in) {
      if (move.action.type === ADD_UNIT) {
        const { unitId, merges = {} } = move.action.data

        const unit = units[unitId]

        target.addUnit(unitId, unit, undefined, undefined, false, false, false)

        for (const mergeId in merges) {
          const merge = merges[mergeId]

          const merge_ = {}

          for (const unitId in merge) {
            if (target.hasUnit(unitId)) {
              merge_[unitId] = merge[unitId]
            }
          }

          if (target.hasMerge(mergeId)) {
            forEachPinOnMerge(merge_, (unitId, type, pinId) => {
              if (!target.hasMergePin(mergeId, unitId, type, pinId)) {
                target.addPinToMerge(
                  mergeId,
                  unitId,
                  type,
                  pinId,
                  false,
                  false,
                  false,
                  false
                )
              }
            })
          } else {
            target.addMerge(merge_, mergeId, false, false, false)
          }
        }
      } else {
        target.act(move.action, false, false, false)
      }
    } else {
      if (move.action.type === REMOVE_UNIT) {
        const { unitId } = move.action.data

        const nextUnitId = deepGetOrDefault(
          map,
          ['unit', unitId, 'in', 'unit', 'unitId'],
          unitId
        )

        const unit = source.removeUnit(
          unitId,
          false,
          false,
          false,
          false,
          false
        )

        units[nextUnitId] = unit
      } else {
        source.act(move.action, false, false, false)
      }
    }
  }
}
