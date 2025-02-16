import { getPinNodeId } from '../../spec/util/spec'
import { IO } from '../../types/IO'
import { MoveMap } from './buildMoveMap'
import { Moves } from './buildMoves'
import { moveNode } from './moveNode'

export const moveLink = (
  map: MoveMap,
  unitId: string,
  type: IO,
  pinId: string
): Moves => {
  const nodeId = getPinNodeId(unitId, type, pinId)

  return moveNode(map, nodeId)
}
