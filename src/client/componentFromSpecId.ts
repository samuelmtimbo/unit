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

  const specs = weakMerge(bundle.specs ?? {}, system.specs)

  const Class = componentClassFromSpecId(
    system.components,
    specs,
    unit.id,
    {},
    subComponentMap
  )

  const component = new Class({}, system)

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
    id,
    {},
    subComponentMap
  )

  const component = new Class(props, system)

  return component
}
