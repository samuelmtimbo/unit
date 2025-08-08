import {
  GraphMoveSubComponentRootData,
  GraphSetSubComponentSizeData,
} from '../../Class/Graph/interface'
import { deepSet_ } from '../../deepSet'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import { insert, pull, push, removeAt, reorder } from '../../util/array'
import {
  deepDelete,
  deepGet,
  deepGetOrDefault,
  deepSet,
  set,
} from '../../util/object'
import { getComponentSubComponentParentId } from '../util/component'

export const appendRoot = (
  { childId }: { childId: string },
  component: GraphComponentSpec
): void => {
  component.children = component.children ?? []

  push(component.children, childId)
}

export const insertRoot = (
  { childId, at }: { childId: string; at: number },
  component: GraphComponentSpec
): void => {
  component.children = component.children || []

  insert(component.children, childId, at)
}

export const removeRoot = ({ childId }, state: GraphComponentSpec): void => {
  pull(state.children, childId)
}

export const setSubComponent = (
  {
    unitId,
    subComponent,
  }: { unitId: string; subComponent: GraphSubComponentSpec },
  component: GraphComponentSpec
): void => {
  deepSet(component, ['subComponents', unitId], subComponent)
}

export const removeSubComponent = (
  { unitId }: { unitId: string },
  component: GraphComponentSpec
): void => {
  const subComponent = deepGetOrDefault(
    component,
    ['subComponents', unitId],
    {}
  )

  const parentId = getComponentSubComponentParentId(component, unitId)

  const { children = [] } = subComponent

  deepDelete(component, ['subComponents', unitId])

  const index = component?.slots?.findIndex(([_unitId]) => _unitId === unitId)

  if (index > -1) {
    removeAt(component.slots, index)
  }

  for (const childId of children) {
    if (parentId) {
      appendSubComponentChild(
        { parentId, childId, slotName: 'default' },
        component
      )
    } else {
      appendRoot({ childId }, component)
    }
  }
}

export const setSize = (
  {
    defaultWidth,
    defaultHeight,
  }: { defaultWidth: number; defaultHeight: number },
  component: GraphComponentSpec
): GraphComponentSpec => {
  return merge(component, { defaultWidth, defaultHeight })
}

export const setChildren = (
  { children }: { children: string[] },
  component: GraphComponentSpec
): GraphComponentSpec => {
  return _set(component, 'children', children)
}

export const setSubComponentSize = (
  { unitId, width, height }: GraphSetSubComponentSizeData,
  component: GraphComponentSpec
): void => {
  deepSet_(
    component,
    ['subComponents', unitId],
    merge(component.subComponents[unitId], { width, height })
  )
}

export const setSubComponentChildren = (
  { parentId, children }: { parentId: string; children: string[] },
  component: GraphComponentSpec
): void => {
  deepSet_(component, ['subComponents', parentId, 'children'], children)
}

export const removeSubComponentChild = (
  { parentId, childId }: { parentId: string; childId: string },
  component: GraphComponentSpec
): void => {
  const subComponent = deepGet(component, ['subComponents', parentId])

  const { children = [], childSlot = {} } = subComponent

  pull(children, childId)

  deepDelete(childSlot, [childId])
}

export const appendSubComponentChild = (
  {
    parentId,
    childId,
    slotName,
  }: { parentId: string; childId: string; slotName: string },
  state: GraphComponentSpec
): void => {
  const { subComponents = {} } = state

  subComponents[parentId] = subComponents[parentId] ?? {}

  const subComponent = subComponents[parentId]

  subComponent.children = subComponent.children || []
  subComponent.childSlot = subComponent.childSlot || {}

  const { children, childSlot } = subComponent

  push(children, childId)
  set(childSlot, childId, slotName)
}

export const insertSubComponentChild = (
  {
    parentId,
    childId,
    slotName = 'default',
    at,
  }: { parentId: string; childId: string; slotName: string; at: number },
  state: GraphComponentSpec
): void => {
  const { subComponents = {} } = state

  subComponents[parentId] = subComponents[parentId] ?? {}

  const subComponent = subComponents[parentId]

  subComponent.children = subComponent.children ?? []
  subComponent.childSlot = subComponent.childSlot ?? {}

  const { children, childSlot } = subComponent

  insert(children, childId, at)
  set(childSlot, childId, slotName)
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
  { parentId, children, slotMap = {} }: GraphMoveSubComponentRootData,
  state: GraphComponentSpec
) => {
  for (const childId of children) {
    const slotName = slotMap[childId] ?? 'default'

    if (parentId) {
      removeRoot({ childId }, state)
      appendSubComponentChild({ parentId, childId, slotName }, state)
    } else {
      appendRoot({ childId }, state)
    }
  }
}

export const moveSubComponentRoot = (
  { parentId, children, slotMap = {} }: GraphMoveSubComponentRootData,
  state: GraphComponentSpec
) => {
  for (const childId of children) {
    const slotName = slotMap[childId]

    const currentParentId = getComponentSubComponentParentId(state, childId)

    if (currentParentId) {
      removeSubComponentChild({ parentId: currentParentId, childId }, state)
    } else {
      removeRoot({ childId }, state)
    }

    if (parentId) {
      appendSubComponentChild({ parentId, childId, slotName }, state)
    } else {
      appendRoot({ childId }, state)
    }
  }
}

export const removeSubComponentFromParent = (
  { subComponentId }: { subComponentId: string },
  component: GraphComponentSpec
) => {
  const currentParentId = getComponentSubComponentParentId(
    component,
    subComponentId
  )

  if (currentParentId) {
    removeSubComponentChild(
      {
        parentId: currentParentId,
        childId: subComponentId,
      },
      component
    )
  } else {
    removeRoot({ childId: subComponentId }, component)
  }
}

export const moveRoot = (
  {
    parentId,
    childId,
    at,
    slotName,
  }: { parentId: string; childId: string; at: number; slotName: string },
  component: GraphComponentSpec
) => {
  removeSubComponentFromParent({ subComponentId: childId }, component)

  if (parentId) {
    insertSubComponentChild({ parentId, childId, slotName, at }, component)
  } else {
    insertRoot({ childId, at }, component)
  }
}
