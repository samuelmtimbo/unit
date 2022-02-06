import { AsyncC } from './AsyncC_'
import { AsyncEE } from './AsyncEE_'
import { AsyncE } from './AsyncE_'
import { AsyncG } from './AsyncG_'
import { AsyncJ } from './AsyncJ_'
import { AsyncPO } from './AsyncPO_'
import { AsyncST } from './AsyncST_'
import { AsyncU } from './AsyncU_'
import { AsyncV } from './AsyncV_'
import { AsyncWrap } from './AsyncWrap'
import { AsyncW } from './AsyncW_'

export const Async = (unit: any, _: string[]) => {
  return AsyncWrap(unit, _, {
    $C: AsyncC,
    $E: AsyncE,
    $G: AsyncG,
    $V: AsyncV,
    $ST: AsyncST,
    $U: AsyncU,
    $J: AsyncJ,
    $PO: AsyncPO,
    $W: AsyncW,
    $EE: AsyncEE,
  })
}
