import {
  GraphExplodeUnitData,
  GraphMoveSubComponentRootData,
} from '../../Class/Graph/interface'
import { GraphMoveSubComponentRootMomentData } from '../../debug/graph/watchGraphMoveSubComponentRoot'
import { GraphSpecComponentAppendMoment } from '../../debug/graph/watchGraphUnitComponentAppendEvent'
import { GraphSubComponentSpec } from '../../types'
import { Dict } from '../../types/Dict'

export const SET_SUB_COMPONENT = 'COMPONENT_SET_SUB_COMPONENT'
export const SET_SUB_COMPONENT_CHILDREN = 'COMPONENT_SET_SUB_COMPONENT_CHILDREN'
export const MOVE_SUB_COMPONENT_ROOT =
  'MOVE_SUB_COMPONENT_ROOT'
export const REMOVE_SUB_COMPONENT = 'COMPONENT_REMOVE_SUB_COMPONENT'
export const SET_SIZE = 'COMPONENT_SET_SIZE'
export const REORDER_SUB_COMPONENT = 'COMPONENT_REORDER_SUB_COMPONENT'

export const makeSetSubComponentAction = (
  id: string,
  spec: GraphSubComponentSpec
) => {
  return {
    type: SET_SUB_COMPONENT,
    data: {
      id,
      spec,
    },
  }
}

export const makeSetSubComponentChildrenAction = (
  id: string,
  children: string[]
) => {
  return {
    type: SET_SUB_COMPONENT,
    data: {
      id,
      children,
    },
  }
}

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
  slotMap: Dict<string>,
  prevSlotMap: Dict<string>
) => {
  return wrapMoveSubComponentRootAction({
    parentId,
    prevParentIdMap,
    children,
    slotMap,
    prevSlotMap,
  })
}

export const makeRemoveSubComponentAction = (id: string) => {
  return {
    type: REMOVE_SUB_COMPONENT,
    data: {
      id,
    },
  }
}

export const makeSetSizeAction = (
  id: string,
  width: number,
  height: number
) => {
  return {
    type: SET_SIZE,
    data: {
      id,
      width,
      height,
    },
  }
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
