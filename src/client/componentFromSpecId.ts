import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { weakMerge } from '../weakMerge'
import { Component } from './component'
import { componentClassFromSpecId } from './componentClassFromSpecId'

export function componentFromUnitBundle(
  system: System,
  bundle: UnitBundleSpec,
  subComponentMap: Dict<Component> = {}
): Component {
  const { unit } = bundle

  const props = {} // TODO derive from unit.input

  const Class = componentClassFromSpecId(
    system.components,
    weakMerge(bundle.specs ?? {}, system.specs),
    system.classes,
    unit.id,
    props,
    subComponentMap
  )

  const component = new Class(props, system)

  return component
}

export function componentFromSpecId(
  system: System,
  specs: Specs,
  id: string,
  props: Dict<any>,
  subComponentMap: Dict<Component> = {}
): Component {
  const Class = componentClassFromSpecId(
    system.components,
    specs,
    system.classes,
    id,
    {},
    subComponentMap
  )

  const component = new Class(props, system)

  return component
}
