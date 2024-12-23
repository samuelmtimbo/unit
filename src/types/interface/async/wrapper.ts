import { AllTypes } from '../../../interface'
import { AsyncA } from './AsyncA'
import { AsyncAB } from './AsyncAB'
import { AsyncAC } from './AsyncAC'
import { AsyncB } from './AsyncB'
import { AsyncBC } from './AsyncBC'
import { AsyncBD } from './AsyncBD'
import { AsyncBS } from './AsyncBS'
import { AsyncBSE } from './AsyncBSE'
import { AsyncC } from './AsyncC'
import { AsyncCA } from './AsyncCA'
import { AsyncCH } from './AsyncCH'
import { AsyncCK } from './AsyncCK'
import { AsyncCS } from './AsyncCS'
import { AsyncD } from './AsyncD'
import { AsyncEE } from './AsyncEE'
import { AsyncF } from './AsyncF'
import { AsyncG } from './AsyncG'
import { AsyncGP } from './AsyncGP'
import { AsyncIB } from './AsyncIB'
import { AsyncIM } from './AsyncIM'
import { AsyncJ } from './AsyncJ'
import { AsyncME } from './AsyncME'
import { AsyncMS } from './AsyncMS'
import { AsyncNO } from './AsyncNO'
import { AsyncPS } from './AsyncPS'
import { AsyncS } from './AsyncS'
import { AsyncTD } from './AsyncTD'
import { AsyncTE } from './AsyncTE'
import { AsyncU } from './AsyncU'
import { AsyncV } from './AsyncV'
import { AsyncWP } from './AsyncWP'

export const ASYNC: AllTypes<(unit: any) => any> = {
  C: AsyncC,
  CA: AsyncCA,
  G: AsyncG,
  V: AsyncV,
  MS: AsyncMS,
  U: AsyncU,
  J: AsyncJ,
  WP: AsyncWP,
  EE: AsyncEE,
  S: AsyncS,
  B: AsyncB,
  IB: AsyncIB,
  CS: AsyncCS,
  GP: AsyncGP,
  BD: AsyncBD,
  BS: AsyncBS,
  BSE: AsyncBSE,
  BC: AsyncBC,
  NO: AsyncNO,
  A: AsyncA,
  PS: AsyncPS,
  CH: AsyncCH,
  F: AsyncF,
  AC: AsyncAC,
  D: AsyncD,
  CK: AsyncCK,
  AB: AsyncAB,
  TE: AsyncTE,
  TD: AsyncTD,
  ME: AsyncME,
  IM: AsyncIM,
}
