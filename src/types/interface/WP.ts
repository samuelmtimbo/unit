import { Component_ } from './Component'

export interface WP {
  refChildContainer(at: number): Component_
  refParentRootContainer(at: number): Component_
  refParentChildContainer(at: number): Component_
}
