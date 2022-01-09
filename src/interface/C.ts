import { Component_ } from '../interface/component'
import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'

export type C_J = {}

export type C_EE = {
  append_child: [{ bundle: UnitBundleSpec }]
  remove_child_at: [{ at: number }]
  [remove_child_at: `remove_child_at_${number}`]: [{ at: number }]
  leaf_append_child: [{ path: string[]; bundle: UnitBundleSpec }]
  leaf_remove_child_at: [{ at: number; path: string[] }]
  sub_component_append_child: [string, string, string]
  sub_component_append_children: [string, string[], Dict<string>]
  register_parent_root: [Component_, string]
  unregister_parent_root: [Component_]
  register_root: [Component_]
  unregister_root: [Component_]
  append_parent_child: [Component_, string]
  remove_parent_child: [Component_]
}

export interface C {
  registerRoot(component: Component_): void

  unregisterRoot(component: Component_): void

  registerParentRoot(component: Component_, slotName: string): void

  unregisterParentRoot(component: Component_): void

  appendParentChild(component: Component_, slotName: string): void

  removeParentChild(component: Component_): void

  appendChild(Class: UnitClass<Component_>): number

  pushChild(Class: UnitClass<Component_>): number

  removeChild(at: number): UnitClass<Component_>

  pullChild(at: number): UnitClass<Component_>

  hasChild(at: number): boolean

  refChild(at: number): Component_

  refChildren(): Component_[]

  refSlot(slotName: string): Component_
}
