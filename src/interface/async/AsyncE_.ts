import { E } from '../E'
import { $E, $E_C, $E_R, $E_W } from './$E'

export const AsyncECall = (e: E): $E_C => {
  return {}
}

export const AsyncEWatch = (e: E): $E_W => {
  return {}
}

export const AsyncERef = (e: E): $E_R => {
  return {}
}

export const AsyncE: (e: E) => $E = (e: E) => {
  return {
    ...AsyncECall(e),
    ...AsyncEWatch(e),
    ...AsyncERef(e),
  }
}
