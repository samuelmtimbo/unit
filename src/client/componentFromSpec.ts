import { System } from '../system'
import { Specs } from '../types'
import { GraphSpec } from '../types/GraphSpec'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'

export function componentFromSpec(
  system: System,
  spec: GraphSpec,
  specs: Specs
): Component {
  const Class = componentClassFromSpec(spec, specs)
  const component = new Class({}, system)
  return component
}
