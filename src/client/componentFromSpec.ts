import { Pod } from '../pod'
import { System } from '../system'
import { GraphSpec, Specs } from '../types'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'

export function componentFromSpec(
  system: System,
  pod: Pod,
  spec: GraphSpec,
  specs: Specs
): Component {
  const Class = componentClassFromSpec(spec, specs)
  const component = new Class({}, system, pod)
  return component
}
