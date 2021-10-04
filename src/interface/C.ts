import { Callback } from '../Callback'
import { Component } from '../client/component'
import { UnitClass } from '../types/UnitClass'
import { Unlisten } from '../Unlisten'
import { C_U } from './C_U'

export interface C<I = any, O = any> {
  appendChild(Class: UnitClass<C_U>): number

  pushChild(Class: UnitClass<C_U>): number

  removeChild(at: number): UnitClass<C_U>

  pullChild(at: number): UnitClass<C_U>

  hasChild(at: number): boolean

  child(at: number): C

  children(): C[]

  component(callback: Callback<Component>): Unlisten
}
