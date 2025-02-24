import { Graph } from '.'
import { ADD_UNIT, REMOVE_UNIT } from '../../spec/actions/G'
import { Dict } from '../../types/Dict'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { UCG } from '../../types/interface/UCG'
import { clone } from '../../util/clone'
import { deepGetOrDefault } from '../../util/object'
import { Unit } from '../Unit'
import { MoveMapping } from './buildMoveMap'
import { Moves } from './buildMoves'

export function moveSubgraph<T extends UCG<Dict<any>, Dict<any>, any>>(
  source: Graph<T>,
  target: Graph<T>,
  map: MoveMapping,
  moves: Moves,
  reverse: boolean
) {
  let units_: Dict<Unit> = {}
  let units: Dict<GraphUnitSpec> = {}

  const actions = []

  for (const move of moves) {
    if (move.in) {
      if (!reverse) {
        actions.push(clone(move.action))
      }

      if (move.action.type === ADD_UNIT) {
        const { unitId } = move.action.data

        const unit_ = units_[unitId]
        const unit = units[unitId]

        target.addUnit(unitId, unit_, { unit }, undefined, false, false, false)
      } else {
        target.act(move.action, false, false, false)
      }
    } else {
      if (reverse) {
        actions.push(clone(move.action))
      }

      if (move.action.type === REMOVE_UNIT) {
        const { unitId } = move.action.data

        const nextUnitId = deepGetOrDefault(
          map,
          ['unit', unitId, 'in', 'unit', 'unitId'],
          unitId
        )

        const unit = source.getGraphUnitSpec(unitId)

        const unit_ = source.removeUnit(
          unitId,
          false,
          false,
          false,
          false,
          false
        )

        units_[nextUnitId] = unit_
        units[nextUnitId] = unit
      } else {
        source.act(move.action, false, false, false)
      }
    }
  }

  if (reverse) {
    source.emit('bulk_edit', actions, [])
  } else {
    target.emit('bulk_edit', actions, [])
  }
}
