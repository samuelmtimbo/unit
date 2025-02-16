import { MoveMap } from './buildMoveMap'
import { Moves } from './buildMoves'
import { moveNode } from './moveNode'

export const moveUnit = (map: MoveMap, unitId: string): Moves => {
  const nodeId = unitId

  return moveNode(map, nodeId)
}
