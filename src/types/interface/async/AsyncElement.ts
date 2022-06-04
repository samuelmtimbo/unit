import { Element } from '../../../Class/Element'
import { EE } from '../EE'
import { $Element } from './$Element'
import { AsyncC } from './AsyncC'
import { AsyncEE } from './AsyncEE'
import { AsyncE } from './AsyncE'
import { AsyncJ } from './AsyncJ'
import { AsyncU } from './AsyncU'
import { AsyncV } from './AsyncV'

export const AsyncElement: (element: Element) => $Element = (
  element: Element
) => {
  return {
    ...AsyncEE(element as EE),
    ...AsyncU(element),
    ...AsyncC(element),
    ...AsyncV(element),
    ...AsyncJ(element),
    ...AsyncE(element),
  }
}
