import { DetachOpt } from '../../system/platform/api/component/Detach'
import { UnitBundle } from '../UnitBundle'
import { UnitBundleSpec } from '../UnitBundleSpec'
import { Unlisten } from '../Unlisten'
import { Component_ } from './Component'

export type C_J = {}

export type C_EE = {
  append_child: [{ child: Component_; bundle: UnitBundleSpec }, string[]]
  append_children: [{ bundles: UnitBundleSpec[] }, string[]]
  insert_child: [{ bundle: UnitBundleSpec; at: number }, string[]]
  remove_child: [{ at: number }, string[]]
  [remove_child_at: `remove_child_at_${number}`]: [{ at: number }, string[]]
  register_parent_root: [{ component: Component_; slotName: string }, string[]]
  unregister_parent_root: [{ component: Component_ }, string[]]
  register_root: [{ subComponentId: string }, string[]]
  unregister_root: [{ subComponentId: string }, string[]]
  set_sub_component: [
    { subComponentId: string; bundle: UnitBundleSpec },
    string[],
  ]
  reorder_root: [{ from: number; to: number }, string[]]
  reorder_parent_root: [{ from: number; to: number }, string[]]
  call: [{ method: string; data: any[] }]
}

export type AnimationSpec = {
  opt: KeyframeAnimationOptions
  keyframes: Keyframe[]
}

export type ComponentSetup = {
  animations: AnimationSpec[]
  events: string[]
  stopPropagation: string[]
  stopImmediatePropagation: string[]
  preventDefault: string[]
  attachText: [string, string][]
  detachTo: { host: string; opt: DetachOpt }
  attachDropTarget: [][]
}

export interface C {
  registerRoot(
    component: Component_,
    subComponentId: string,
    ...extra: any[]
  ): void
  unregisterRoot(
    component: Component_,
    subComponentId: string,
    ...extra: any[]
  ): void
  reorderRoot(component: Component_, to: number, ...extra: any[]): void
  registerParentRoot(
    component: Component_,
    subComponentId: string,
    slotName: string,
    at?: number,
    ...extra: any[]
  ): void
  unregisterParentRoot(
    component: Component_,
    subComponentId: string,
    ...extra: any[]
  ): void
  reorderParentRoot(component: Component_, to: number, ...extra: any[]): void
  appendParentChild(
    component: Component_,
    slotName: string,
    ...extra: any[]
  ): void
  removeParentChild(component: Component_, ...extra: any[]): void
  appendChild(Class: UnitBundle): number
  appendChildren(Classes: UnitBundle[]): number
  insertChild(Class: UnitBundle, at: number): void
  pushChild(Class: UnitBundle): number
  removeChild(at: number): Component_
  pullChild(at: number): Component_
  hasChild(at: number): boolean
  refChild(at: number): Component_
  refChildren(): Component_[]
  refSlot(slotName: string): Component_
  refRoot(at: number): Component_
  animate(keyframes: Keyframe[], opt: KeyframeAnimationOptions): void
  cancelAnimation(id: string): void
  getAnimations(): AnimationSpec[]
  stopPropagation(name: string): Unlisten
  attachText(type: string, text: string): Unlisten
  attachDropTarget(): Unlisten
  detach(host: Component_, opt: DetachOpt): Unlisten
  getSetup(): ComponentSetup
}
