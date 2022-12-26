import { System } from '../system'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'

export function componentFromSpecId(
  system: System,
  id: string,
  props: Dict<any>,
  sub_component_map: Dict<Component> = {}
): Component {
  const Class = componentClassFromSpecId(system, id, {}, sub_component_map)

  const component = new Class(props, system)

  return component
}
