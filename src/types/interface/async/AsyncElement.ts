import { Element_ } from '../../../Class/Element'
import { EE } from '../EE'
import { $Element } from './$Element'
import { AsyncC } from './AsyncC'
import { AsyncE } from './AsyncE'
import { AsyncEE } from './AsyncEE'
import { AsyncJ } from './AsyncJ'
import { AsyncU } from './AsyncU'
import { AsyncV } from './AsyncV'

export const AsyncElement: (element: Element_) => $Element = (
  element: Element_
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
