import { E } from '../E'
import { $Element } from './$Element'
import { AsyncC } from './AsyncC_'
import { AsyncE } from './AsyncE_'
import { AsyncJ } from './AsyncJ_'
import { AsyncU } from './AsyncU_'
import { AsyncV } from './AsyncV_'

export const AsyncElement: (element: E) => $Element = (element: E) => {
  return {
    ...AsyncU(element),
    ...AsyncC(element),
    ...AsyncV(element),
    ...AsyncJ(element),
    ...AsyncE(element),
  }
}
