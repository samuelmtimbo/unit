import { C } from '../C'
import { U } from '../U'
import { $Component } from './$Component'
import { AsyncC } from './AsyncC_'
import { AsyncU } from './AsyncU_'

export const AsyncComponent: (component: C & U) => $Component = (
  component: C & U
) => {
  return {
    ...AsyncU(component),
    ...AsyncC(component),
  }
}
