import { Pod } from '../pod'
import { System } from '../system'
import { GraphSpec } from '../types'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'

export function componentFromSpec(
  $system: System,
  $pod: Pod,
  spec: GraphSpec
): Component {
  const Class = componentClassFromSpec(spec)
  const component = new Class({}, $system, $pod)
  return component
}
