import { Component_ } from '../Component'
import { $Component } from './$Component'
import { Async$ } from './Async$'
import { AsyncC } from './AsyncC'
import { AsyncEE } from './AsyncEE'
import { AsyncU } from './AsyncU'

export const AsyncComponent: (component: Component_<any>) => $Component = (
  component: Component_<any>
) => {
  return {
    ...Async$(component),
    ...AsyncEE(component),
    ...AsyncU(component),
    ...AsyncC(component),
  }
}
