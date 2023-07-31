import { GraphMoveSubComponentRootData } from '../../Class/Graph/interface'
import removeIndex from '../../system/core/array/RemoveIndex/f'
import assocPath from '../../system/core/object/AssocPath/f'
import pathGet from '../../system/core/object/DeepGet/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import $indexOf from '../../system/f/array/IndexOf/f'
import { _insert } from '../../system/f/array/Insert/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import { pull, push, reorder } from '../../util/array'
import { pathSet } from '../../util/object'
import { getComponentSubComponentParentId } from '../util'

export const defaultState: GraphComponentSpec = {}

export const appendChild = (
  { unitId }: { unitId: string },
  state: GraphComponentSpec
): void => {
  state.children = state.children ?? []

  state.children.push(unitId)
}

export const insertChild = (
  { id, at }: { id: string; at: number },
  state: GraphComponentSpec
): GraphComponentSpec => {
  const children = state.children || []
  return _set(state, 'children', _insert(children, at, id))
}

export const removeChild = ({ childId }, state: GraphComponentSpec): void => {
  pull(state.children ?? [], childId)
}

export const setSubComponent = (
  { unitId, spec }: { unitId: string; spec: GraphSubComponentSpec },
  state: GraphComponentSpec
): void => {
  pathSet(state, ['subComponents', unitId], spec)
}

export const removeSubComponent = (
  { id }: { id: string },
  state: GraphComponentSpec
): GraphComponentSpec => {
  state = dissocPath(state, ['subComponents', id])
  return state
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
): GraphComponentSpec => {
  return assocPath(
    state,
    ['subComponents', id],
    merge(state.subComponents[id], { width, height })
  )
}

export const setSubComponentChildren = (
  { id, children }: { id: string; children: string[] },
  state: GraphComponentSpec
): GraphComponentSpec => {
  return assocPath(state, ['subComponents', id, 'children'], children)
}

export const removeSubComponentChild = (
  { id, childId }: { id: string; childId: string },
  state: GraphComponentSpec
): GraphComponentSpec => {
  const children = pathGet(state, ['subComponents', id, 'children'])
  const { i } = $indexOf({ 'a[]': children, a: childId })
  const { a: _children } = removeIndex({ a: children, i })
  state = assocPath(state, ['subComponents', id, 'children'], _children)
  return state
}

export const appendSubComponentChild = (
  { parentId, childId }: { parentId: string; childId: string },
  state: GraphComponentSpec
): void => {
  const { subComponents } = state

  const subComponent = subComponents[parentId] || {}

  const { children = [] } = subComponent

  push(children, childId)
}

export const insertSubComponentChild = (
  { id, childId, at }: { id: string; childId: string; at: number },
  state: GraphComponentSpec
): GraphComponentSpec => {
  const { subComponents } = state
  const subComponent = subComponents[id] || {}
  const { children = [] } = subComponent
  return assocPath(
    state,
    ['subComponents', id, 'children'],
    _insert(children, at, childId)
  )
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
      appendSubComponentChild({ parentId: parentId, childId }, state)
    } else {
      appendChild({ unitId: childId }, state)
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
      removeSubComponentChild({ id: currentParentId, childId }, state)
    } else {
      removeChild({ childId }, state)
    }

    if (parentId) {
      appendSubComponentChild({ parentId, childId }, state)
    } else {
      appendChild({ unitId: childId }, state)
    }
  }
}
