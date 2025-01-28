import { GraphMoveSubComponentRootMomentData } from '../../debug/graph/watchGraphMoveSubComponentRoot'
import { Dict } from '../../types/Dict'

export const MOVE_SUB_COMPONENT_ROOT = 'moveSubComponentRoot'
export const REORDER_SUB_COMPONENT = 'reorderSubComponent'

export const wrapMoveSubComponentRootAction = (
  data: GraphMoveSubComponentRootMomentData
) => {
  return {
    type: MOVE_SUB_COMPONENT_ROOT,
    data,
  }
}

export const makeMoveSubComponentRootAction = (
  parentId: string | null,
  prevParentIdMap: Dict<string | null>,
  children: string[],
  index: number,
  slotMap: Dict<string>,
  prevSlotMap: Dict<string>
) => {
  return wrapMoveSubComponentRootAction({
    parentId,
    prevParentIdMap,
    children,
    index,
    slotMap,
    prevSlotMap,
  })
}

export const makeReorderSubComponentAction = (
  parentId: string | null,
  childId: string,
  from: number,
  to: number
) => {
  return {
    type: REORDER_SUB_COMPONENT,
    data: {
      parentId,
      childId,
      from,
      to,
    },
  }
}
