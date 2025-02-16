import { getExtNodeId } from '../../client/id'
import { IO } from '../../types/IO'
import { MoveMap } from './buildMoveMap'
import { Moves } from './buildMoves'
import { moveNode } from './moveNode'

export const movePlug = (
  map: MoveMap,
  type: IO,
  pinId: string,
  subPinId: string
): Moves => {
  const nodeId = getExtNodeId(type, pinId, subPinId)

  return moveNode(map, nodeId)
}
