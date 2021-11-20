import { System } from '../system'
import { GraphSpec } from '../types'
import { Component, componentClassFromSpec } from './component'

export function componentFromSpec($system: System, spec: GraphSpec): Component {
  const Class = componentClassFromSpec($system, spec)
  const component = new Class({}, $system)
  return component
}
