import { GraphComponentSpec } from '../../types'
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
