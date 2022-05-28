import { Pod } from '../pod'
import { System } from '../system'
import { GraphUnitSpec } from '../types'
import { Component } from './component'
import { componentFromSpecId } from './componentFromSpecId'

export function componentFromUnitSpec(
  system: System,
  pod: Pod,
  unitSpec: GraphUnitSpec
): Component {
  const { id } = unitSpec

  return componentFromSpecId(
    system,
    pod,
    { ...this.$system.specs, ...this.$pod.specs },
    id,
    {} /** TODO */
  )
}
