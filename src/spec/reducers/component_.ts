import { GraphMoveSubComponentRootData } from '../../Class/Graph/interface'
import deepGet from '../../deepGet'
import { deepSet_ } from '../../deepSet'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import { insert, pull, push, removeAt, reorder } from '../../util/array'
import { pathDelete, pathOrDefault, pathSet } from '../../util/object'
import { getComponentSubComponentParentId } from '../util/component'

export const appendChild = (
  { childId }: { childId: string },
  state: GraphComponentSpec
): void => {
  state.children = state.children ?? []

  state.children.push(childId)
}

export const insertChild = (
  { childId, at }: { childId: string; at: number },
  state: GraphComponentSpec
): void => {
  const children = state.children || []

  insert(children, childId, at)
}

export const removeChild = ({ childId }, state: GraphComponentSpec): void => {
  pull(state.children, childId)
}

export const setSubComponent = (
  {
    unitId,
    subComponent,
  }: { unitId: string; subComponent: GraphSubComponentSpec },
  state: GraphComponentSpec
): void => {
  pathSet(state, ['subComponents', unitId], subComponent)
}

export const removeSubComponent = (
  { unitId }: { unitId: string },
  state: GraphComponentSpec
): void => {
  const subComponent = pathOrDefault(state, ['subComponents', unitId], {})

  const parentId = getComponentSubComponentParentId(state, unitId)

  const { children = [] } = subComponent

  pathDelete(state, ['subComponents', unitId])

  const index = state?.slots?.findIndex(([_unitId]) => _unitId === unitId)

  if (index > -1) {
    removeAt(state.slots, index)
  }

  for (const childId of children) {
    if (parentId) {
      appendSubComponentChild({ parentId, childId }, state)
    } else {
      appendChild({ childId }, state)
    }
  }
}

export const setSize = (
  {
    defaultWidth,
    defaultHeight,
  }: { defaultWidth: number; defaultHeight: number },
  state: GraphComponentSpec
): GraphComponentSpec => {
  return merge(state, { defaultWidth, defaultHeight })
}

export const setChildren = (
  { children }: { children: string[] },
  state: GraphComponentSpec
): GraphComponentSpec => {
  return _set(state, 'children', children)
}

export const setSubComponentSize = (
  { id, width, height }: { id: string; width: number; height: number },
  state: GraphComponentSpec
): void => {
  deepSet_(
    state,
    ['subComponents', id],
    merge(state.subComponents[id], { width, height })
  )
}

export const setSubComponentChildren = (
  { id, children }: { id: string; children: string[] },
  state: GraphComponentSpec
): void => {
  deepSet_(state, ['subComponents', id, 'children'], children)
}

export const removeSubComponentChild = (
  { subComponentId, childId }: { subComponentId: string; childId: string },
  state: GraphComponentSpec
): void => {
  const subComponent = deepGet(state, ['subComponents', subComponentId])

  const { children = [], childSlot = {} } = subComponent

  pull(children, childId)

  pathDelete(childSlot, [childId])
}

export const appendSubComponentChild = (
  { parentId, childId }: { parentId: string; childId: string },
  state: GraphComponentSpec
): void => {
  const { subComponents } = state

  subComponents[parentId] = subComponents[parentId] ?? {}

  const subComponent = subComponents[parentId]

  subComponent.children = subComponent.children || []

  const { children } = subComponent

  push(children, childId)
}

export const insertSubComponentChild = (
  { parentId, childId, at }: { parentId: string; childId: string; at: number },
  state: GraphComponentSpec
): void => {
  const { subComponents } = state

  subComponents[parentId] = subComponents[parentId] ?? {}

  const subComponent = subComponents[parentId]

  subComponent.children = subComponent.children ?? []

  const { children } = subComponent

  insert(children, childId, at)
}

export const reorderSubComponent = (
  { parentId, childId, to }: { parentId: string; childId: string; to: number },
  state: GraphComponentSpec
): void => {
  if (parentId) {
    reorder(state.subComponents[parentId].children ?? [], childId, to)
  } else {
    reorder(state.children, childId, to)
  }
}

export const _removeSubComponentFromParent = (
  { parentId, children, slotMap }: GraphMoveSubComponentRootData,
  state: GraphComponentSpec
) => {
  for (const childId of children) {
    if (parentId) {
      removeChild({ childId }, state)
      appendSubComponentChild({ parentId, childId }, state)
    } else {
      appendChild({ childId }, state)
    }
  }
}

export const moveSubComponentRoot = (
  { parentId, children, slotMap }: GraphMoveSubComponentRootData,
  state: GraphComponentSpec
) => {
  for (const childId of children) {
    const currentParentId = getComponentSubComponentParentId(state, childId)

    if (currentParentId) {
      removeSubComponentChild(
        { subComponentId: currentParentId, childId },
        state
      )
    } else {
      removeChild({ childId }, state)
    }

    if (parentId) {
      appendSubComponentChild({ parentId, childId }, state)
    } else {
      appendChild({ childId }, state)
    }
  }
}
