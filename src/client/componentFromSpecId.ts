import { Pod } from '../pod'
import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'

export function componentFromSpecId(
  system: System,
  pod: Pod,
  specs: Specs,
  id: string,
  props: Dict<any>
): Component {
  const Class = componentClassFromSpecId(system, specs, id)

  const component = new Class(props, system, pod)
  
  return component
}
