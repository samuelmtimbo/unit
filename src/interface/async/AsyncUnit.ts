import { U } from '../U'
import { $U } from './$U'
import { AsyncU } from './AsyncU_'

export const AsyncUnit: (unit: U) => $U = (unit: U) => {
  return {
    ...AsyncU(unit),
  }
}
