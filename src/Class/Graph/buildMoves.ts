import { act } from '../../spec/actions/G'
import { Specs } from '../../types'
import { Action } from '../../types/Action'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphSelection } from '../../types/interface/G'
import { clone } from '../../util/clone'
import { MoveMap } from './buildMoveMap'
import { moveLink } from './moveLink'
import { moveMerge } from './moveMerge'
import { movePlug } from './movePlug'
import { moveUnit } from './moveUnit'

export type Moves = Move[]

export type Move = {
  in: boolean
  action: Action
}

export const applyMoves = (
  specs: Specs,
  source: GraphSpec,
  target: GraphSpec,
  moves: Moves
): { source: GraphSpec; target: GraphSpec } => {
  const source_ = clone(source)
  const target_ = clone(target)

  for (const move of moves) {
    if (move.in) {
      act(specs, target_, move.action.type, move.action.data)
    } else {
      act(specs, source_, move.action.type, move.action.data)
    }
  }

  return { source: source_, target: target_ }
}

export const applyMoves_ = (
  specs: Specs,
  source: GraphSpec,
  target: GraphSpec,
  moves: Moves
): void => {
  for (const move of moves) {
    if (move.in) {
      act(specs, target, move.action.type, move.action.data)
    } else {
      act(specs, source, move.action.type, move.action.data)
    }
  }
}

export const buildMoves = (selection: GraphSelection, map: MoveMap): Moves => {
  const moves: Moves = []

  for (const unitId of selection.unit ?? []) {
    moves.push(...moveUnit(map, unitId))
  }

  for (const mergeId of selection.merge ?? []) {
    moves.push(...moveMerge(map, mergeId))
  }

  for (const { unitId, type, pinId } of selection.link ?? []) {
    moves.push(...moveLink(map, unitId, type, pinId))
  }

  for (const { type, pinId, subPinId } of selection.plug ?? []) {
    moves.push(...movePlug(map, type, pinId, subPinId))
  }

  return moves
}
