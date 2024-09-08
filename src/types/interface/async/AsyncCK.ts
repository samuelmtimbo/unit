import { CK } from '../CK'
import { $CK, $CK_C, $CK_G, $CK_R, $CK_W } from './$CK'

export const AsyncCKGet = (date: CK): $CK_G => ({})

export const AsyncCKCall = (date: CK): $CK_C => ({})

export const AsyncCKWatch = (date: CK): $CK_W => {
  return {}
}

export const AsyncCKRef = (date: CK): $CK_R => ({})

export const AsyncCK = (date: CK): $CK => {
  return {
    ...AsyncCKGet(date),
    ...AsyncCKCall(date),
    ...AsyncCKWatch(date),
    ...AsyncCKRef(date),
  }
}
