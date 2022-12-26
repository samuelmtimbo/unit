import { System } from '../system'
import { GraphUnitSpec } from '../types'
import { Component } from './component'
import { componentFromSpecId } from './componentFromSpecId'

export function componentFromUnitSpec(
  system: System,
  unitSpec: GraphUnitSpec
): Component {
  const { id } = unitSpec

  return componentFromSpecId(system, id, {} /** TODO */)
}
