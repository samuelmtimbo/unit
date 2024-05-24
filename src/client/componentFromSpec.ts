import { Memory } from '../Class/Unit/Memory'
import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'

export type ComponentState = {
  data: Dict<any>
  children: Dict<Component>
}

export function componentFromSpec(
  system: System,
  spec: GraphSpec,
  specs: Specs,
  memory?: Partial<Memory>
): Component {
  const Class = componentClassFromSpec(spec, specs, {}, memory)

  const component = new Class({}, system)

  return component
}
