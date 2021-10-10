import { AsyncC } from './AsyncC_'
import { AsyncE } from './AsyncE_'
import { AsyncG } from './AsyncG_'
import { AsyncJ } from './AsyncJ_'
import { AsyncST } from './AsyncST_'
import { AsyncU } from './AsyncU_'
import { AsyncV } from './AsyncV_'
import { AsyncWrap } from './AsyncWrap'

export const Async = (unit: any, _: string[]) => {
  return AsyncWrap(unit, _, {
    $C: AsyncC,
    $E: AsyncE,
    $G: AsyncG,
    $V: AsyncV,
    $ST: AsyncST,
    $U: AsyncU,
    $J: AsyncJ,
  })
}
