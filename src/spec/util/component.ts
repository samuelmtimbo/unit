import { GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import { GraphSpec } from '../../types/GraphSpec'

export function getSubComponentParentId(
  spec: GraphSpec,
  unitId: string
): string | null {
  return getComponentSubComponentParentId(spec.component ?? {}, unitId)
}

export function getSubComponentChildren(
  spec: GraphSpec,
  unitId: string
): string[] {
  return getComponentSubComponentChildren(spec.component ?? {}, unitId)
}

export function getComponentSubComponentParentId(
  componentSpec: GraphComponentSpec,
  unitId: string
): string | null {
  const { subComponents } = componentSpec

  for (const subComponentId in subComponents) {
    const subComponent = subComponents[subComponentId]

    const { children = [] } = subComponent

    for (const childId of children) {
      if (childId === unitId) {
        return subComponentId
      }
    }
  }

  return null
}

export function getComponentSubComponentChildren(
  componentSpec: GraphComponentSpec,
  unitId: string
): string[] {
  const { subComponents = {} } = componentSpec

  const subComponent = subComponents[unitId] ?? {}

  const { children = [] } = subComponent

  return children
}

export function getSpecComponentSpec(spec: GraphSpec) {
  const { component = {} } = spec

  return component
}

export function getSubComponentSpec(
  spec: GraphSpec,
  subComponentId: string
): GraphSubComponentSpec {
  const component = getSpecComponentSpec(spec)

  const { subComponents = {} } = component

  const subComponent = subComponents[subComponentId]

  return subComponent
}

export function getSubComponentChildrenSlot(
  spec: GraphSpec,
  subComponentId: string
) {
  const children = getSubComponentChildren(spec, subComponentId)

  const childrenSlotMap = {}

  for (const childId of children) {
    childrenSlotMap[childId] = getSubComponentParentSlotName(spec, childId)
  }

  return childrenSlotMap
}

export function getSubComponentSlot(
  spec: GraphSpec,
  subComponentId: string
): string | null {
  const component = getSpecComponentSpec(spec)

  const { slots = [] } = component

  for (const slot of slots) {
    const [slotUnitId, slotName] = slot

    if (slotUnitId === subComponentId) {
      return slotName
    }
  }

  return null
}

export function getSubComponentParentSlotName(
  spec: GraphSpec,
  subComponentId: string
): string {
  const parentId = getSubComponentParentId(spec, subComponentId)

  if (parentId) {
    const parentComponentSpec = getSubComponentSpec(spec, parentId)

    const { childSlot = {} } = parentComponentSpec

    return childSlot[subComponentId] || 'default'
  } else {
    return 'default'
  }
}

export function getSubComponentParentRootIndex(
  spec: GraphSpec,
  parentId: string,
  unitId: string
): number {
  const children = getSubComponentChildren(spec, parentId)

  const index = children.indexOf(unitId)

  return index
}

export function getSpecComponentSpecChildren(spec: GraphSpec) {
  const component = getSpecComponentSpec(spec)

  const { children = [] } = component

  return children
}

export function getSubComponentRootIndex(spec: GraphSpec, unitId: string) {
  const children = getSpecComponentSpecChildren(spec)

  const index = children.indexOf(unitId)

  return index
}

export function getSubComponentParentIndex(spec: GraphSpec, unitId: string) {
  const parentId = getSubComponentParentId(spec, unitId)

  if (parentId) {
    return getSubComponentParentRootIndex(spec, parentId, unitId)
  } else {
    return getSubComponentRootIndex(spec, unitId)
  }
}

export function getDefaultSlotSubComponentId(spec: GraphSpec): string | null {
  const component = getSpecComponentSpec(spec)

  for (const slot of component?.slots ?? []) {
    const [subComponentId, slotName] = slot

    if (slotName === 'default') {
      return subComponentId
    }
  }

  return null
}
