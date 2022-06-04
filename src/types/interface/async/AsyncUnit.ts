import { Unit } from '../../../Class/Unit'
import { $U } from './$U'
import { AsyncU } from './AsyncU'

export const AsyncUnit: (unit: Unit) => $U = (unit: Unit) => {
  return {
    ...AsyncU(unit),
  }
}
