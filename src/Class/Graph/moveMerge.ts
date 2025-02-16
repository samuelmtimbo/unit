import { getMergeNodeId } from '../../client/id'
import { MoveMap } from './buildMoveMap'
import { Moves } from './buildMoves'
import { moveNode } from './moveNode'

export const moveMerge = (map: MoveMap, mergeId: string): Moves => {
  const nodeId = getMergeNodeId(mergeId)

  return moveNode(map, nodeId)
}
