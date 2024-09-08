import { F } from '../F'
import { $F, $F_C, $F_G, $F_R, $F_W } from './$F'

export const AsyncFGet = (file: F): $F_G => ({})

export const AsyncFCall = (file: F): $F_C => ({})

export const AsyncFWatch = (file: F): $F_W => {
  return {}
}

export const AsyncFRef = (file: F): $F_R => ({})

export const AsyncF = (file: F): $F => {
  return {
    ...AsyncFGet(file),
    ...AsyncFCall(file),
    ...AsyncFWatch(file),
    ...AsyncFRef(file),
  }
}
