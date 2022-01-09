import removeIndex from '../../system/core/array/RemoveIndex/f'
import assocPath from '../../system/core/object/AssocPath/f'
import dissocPath from '../../system/core/object/DissocPath/f'
import pathGet from '../../system/core/object/PathGet/f'
import $indexOf from '../../system/f/array/IndexOf/f'
import merge from '../../system/f/object/Merge/f'
import set from '../../system/f/object/Set/f'
import { Action, GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import {
  REMOVE_SUB_COMPONENT,
  SET_SIZE,
  SET_SUB_COMPONENT,
  SET_SUB_COMPONENT_CHILDREN,
} from '../actions/component'

export type State = GraphComponentSpec

export const defaultState: State = {}

export const appendChild = ({ id }, state: State): State => {
  const children = state.children || []
  return set(state, 'children', [...children, id])
}

export const removeChild = ({ id }, state: State): State => {
  const children = [...(state.children || [])]
  const index = children.indexOf(id)
  if (index > -1) {
    children.splice(index, 1)
    return set(state, 'children', children)
  }
  return state
}

export const setSubComponent = (
  { id, spec }: { id: string; spec: GraphSubComponentSpec },
  state: State
): State => {
  return assocPath(state, ['subComponents', id], spec)
}

export const removeSubComponent = (
  { id }: { id: string },
  state: State
): State => {
  state = dissocPath(state, ['subComponents', id])
  return state
}

export const setSize = (
  {
    defaultWidth,
    defaultHeight,
  }: { defaultWidth: number; defaultHeight: number },
  state: State
): State => {
  return merge(state, { defaultWidth, defaultHeight })
}

export const setChildren = (
  { children }: { children: string[] },
  state: State
): State => {
  return set(state, 'children', children)
}

export const setSubComponentSize = (
  { id, width, height }: { id: string; width: number; height: number },
  state: State
): State => {
  return assocPath(
    state,
    ['subComponents', id],
    merge(state.subComponents[id], { width, height })
  )
}

export const setSubComponentChildren = (
  { id, children }: { id: string; children: string[] },
  state: State
): State => {
  return assocPath(state, ['subComponents', id, 'children'], children)
}

export const removeSubComponentChild = (
  { id, childId }: { id: string; childId: string },
  state: State
): State => {
  const children = pathGet(state, ['subComponents', id, 'children'])
  const { i } = $indexOf({ 'a[]': children, a: childId })
  const { a: _children } = removeIndex({ a: children, i })
  state = assocPath(state, ['subComponents', id, 'children'], _children)
  return state
}

export const appendSubComponentChild = (
  { id, childId }: { id: string; childId: string },
  state: State
): State => {
  const { subComponents } = state
  const subComponent = subComponents[id]
  const { children } = subComponent
  return assocPath(
    state,
    ['subComponents', id, 'children'],
    [...children, childId]
  )
}

export default function (
  state: State = defaultState,
  { type, data }: Action
): State {
  switch (type) {
    case SET_SUB_COMPONENT:
      return setSubComponent(data, state)
    case REMOVE_SUB_COMPONENT:
      return removeSubComponent(data, state)
    case SET_SIZE:
      return setSubComponentSize(data, state)
    case SET_SUB_COMPONENT_CHILDREN:
      return setSubComponentChildren(data, state)
    default:
      return state
  }
}
