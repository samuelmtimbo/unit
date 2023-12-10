import { GraphComponentSpec } from '../../types'
import { GraphSpec } from '../../types/GraphSpec'

export function getSubComponentParentId(
  spec: GraphSpec,
  unitId: string
): string | null {
  return getComponentSubComponentParentId(spec.component, unitId)
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
