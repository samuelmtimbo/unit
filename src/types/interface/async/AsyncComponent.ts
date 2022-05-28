import { Component_ } from '../Component'
import { EE } from '../EE'
import { $Component } from './$Component'
import { AsyncC } from './AsyncC'
import { AsyncEE } from './AsyncEE'
import { AsyncU } from './AsyncU'

export const AsyncComponent: (component: Component_) => $Component = (
  component: Component_
) => {
  return {
    ...AsyncEE(component as EE),
    ...AsyncU(component),
    ...AsyncC(component),
  }
}
