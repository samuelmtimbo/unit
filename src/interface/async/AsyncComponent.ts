import { Component_ } from '../../interface/component'
import { $Component } from './$Component'
import { AsyncC } from './AsyncC_'
import { AsyncU } from './AsyncU_'

export const AsyncComponent: (component: Component_) => $Component = (
  component: Component_
) => {
  return {
    ...AsyncU(component),
    ...AsyncC(component),
  }
}
