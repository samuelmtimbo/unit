import { AsyncC } from './AsyncC'
import { AsyncCA } from './AsyncCA'
import { AsyncE } from './AsyncE'
import { AsyncEE } from './AsyncEE'
import { AsyncG } from './AsyncG'
import { AsyncJ } from './AsyncJ'
import { AsyncMS } from './AsyncMS'
import { AsyncS } from './AsyncS'
import { AsyncU } from './AsyncU'
import { AsyncV } from './AsyncV'
import { AsyncW } from './AsyncW'
import { AsyncWrap } from './AsyncWrap'

export const Async = (unit: any, _: string[]) => {
  if (unit.__async) {
    return unit
  }

  return AsyncWrap(unit, _, {
    C: AsyncC,
    CA: AsyncCA,
    E: AsyncE,
    G: AsyncG,
    V: AsyncV,
    MS: AsyncMS,
    U: AsyncU,
    J: AsyncJ,
    W: AsyncW,
    EE: AsyncEE,
    S: AsyncS,
  })
}
