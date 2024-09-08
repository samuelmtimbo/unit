import { D } from '../D'
import { $D, $D_C, $D_G, $D_R, $D_W } from './$D'

export const AsyncDGet = (date: D): $D_G => ({})

export const AsyncDCall = (date: D): $D_C => ({})

export const AsyncDWatch = (date: D): $D_W => {
  return {}
}

export const AsyncDRef = (date: D): $D_R => ({})

export const AsyncD = (date: D): $D => {
  return {
    ...AsyncDGet(date),
    ...AsyncDCall(date),
    ...AsyncDWatch(date),
    ...AsyncDRef(date),
  }
}
