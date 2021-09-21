import { GraphUnitSpec } from '../types'
import { Component, componentFromSpecId } from './component'

export function componentFromUnitSpec(unitSpec: GraphUnitSpec): Component {
  const { path } = unitSpec
  return componentFromSpecId(path, {} /** TODO */)
}
