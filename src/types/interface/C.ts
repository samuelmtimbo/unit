import { Dict } from '../Dict'
import { UnitBundle } from '../UnitBundle'
import { UnitBundleSpec } from '../UnitBundleSpec'
import { Component_ } from './Component'

export type C_J = {}

export type C_EE = {
  append_child: [{ bundle: UnitBundleSpec }]
  insert_child: [{ bundle: UnitBundleSpec; at: number }]
  remove_child: [{ at: number }]
  [remove_child_at: `remove_child_at_${number}`]: [{ at: number }]
  leaf_append_child: [{ path: string[]; bundle: UnitBundleSpec }]
  leaf_remove_child: [{ at: number; path: string[] }]
  leaf_insert_child: [{ path: string[]; at: number; bundle: UnitBundleSpec }]
  append_parent_root: [string, string, string]
  append_parent_root_children: [string, string[], Dict<string>]
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
  appendChild(Class: UnitBundle<Component_>): number
  insertChild(Class: UnitBundle<Component_>, at: number): void
  pushChild(Class: UnitBundle<Component_>): number
  removeChild(at: number): Component_
  pullChild(at: number): Component_
  hasChild(at: number): boolean
  refChild(at: number): Component_
  refChildren(): Component_[]
  refSlot(slotName: string): Component_
}
