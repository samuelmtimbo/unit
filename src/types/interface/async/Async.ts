import { AsyncC } from './AsyncC'
import { AsyncEE } from './AsyncEE'
import { AsyncE } from './AsyncE'
import { AsyncG } from './AsyncG'
import { AsyncJ } from './AsyncJ'
import { AsyncPO } from './AsyncP'
import { AsyncST } from './AsyncST'
import { AsyncU } from './AsyncU'
import { AsyncV } from './AsyncV'
import { AsyncWrap } from './AsyncWrap'
import { AsyncW } from './AsyncW'

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
