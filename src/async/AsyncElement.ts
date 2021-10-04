import { EL } from '../interface/EL'
import { $Element } from './$Element'
import { AsyncC } from './AsyncC_'
import { AsyncE } from './AsyncE_'
import { AsyncJ } from './AsyncJ_'
import { AsyncU } from './AsyncU_'
import { AsyncV } from './AsyncV_'

export const AsyncElement: (element: EL) => $Element = (element: EL) => {
  return {
    ...AsyncU(element),
    ...AsyncC(element),
    ...AsyncV(element),
    ...AsyncJ(element),
    ...AsyncE(element),
  }
}
