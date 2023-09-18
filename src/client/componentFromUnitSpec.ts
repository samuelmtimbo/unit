import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { Component } from './component'
import { componentFromSpecId } from './componentFromSpecId'

export function componentFromUnitSpec(
  system: System,
  specs: Specs,
  unitSpec: GraphUnitSpec,
  subComponentMap: Dict<Component> = {}
): Component {
  const { id } = unitSpec

  return componentFromSpecId(system, specs, id, subComponentMap)
}
