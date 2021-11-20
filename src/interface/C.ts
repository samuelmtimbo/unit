import { Callback } from '../Callback'
import { Component } from '../client/component'
import { UnitClass } from '../types/UnitClass'
import { Unlisten } from '../Unlisten'
import { $_ } from './$_'
import { C_U } from './C_U'

export interface C<I = any, O = any> extends $_ {
  registerRoot(component: C): void

  unregisterRoot(component: C): void

  registerParentRoot(component: C, slotName: string): void

  unregisterParentRoot(component: C): void

  appendParentChild(component: C, slotName: string): void

  removeParentChild(component: C): void

  appendChild(Class: UnitClass<C_U>): number

  pushChild(Class: UnitClass<C_U>): number

  removeChild(at: number): UnitClass<C_U>

  pullChild(at: number): UnitClass<C_U>

  hasChild(at: number): boolean

  refChild(at: number): C

  refChildren(): C[]

  refSlot(slotName: string): C

  component(callback: Callback<Component>): Unlisten
}
