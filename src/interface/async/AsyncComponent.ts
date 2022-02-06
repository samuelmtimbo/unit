import { Component_ } from '../../interface/Component'
import { EE } from '../EE'
import { $Component } from './$Component'
import { AsyncC } from './AsyncC_'
import { AsyncEE } from './AsyncEE_'
import { AsyncU } from './AsyncU_'

export const AsyncComponent: (component: Component_) => $Component = (
  component: Component_
) => {
  return {
    ...AsyncEE(component as EE),
    ...AsyncU(component),
    ...AsyncC(component),
  }
}
