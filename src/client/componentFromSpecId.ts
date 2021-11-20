import { System } from '../system'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'

export function componentFromSpecId(
  $system: System,
  id: string,
  props: Dict<any>
): Component {
  const Class = componentClassFromSpecId($system, id)
  const component = new Class(props, $system)
  return component
}
