import { EL } from '../interface/EL'
import { $E, $E_C, $E_R, $E_W } from './$E'

export const AsyncECall = (e: EL): $E_C => {
  return {}
}

export const AsyncEWatch = (e: EL): $E_W => {
  return {}
}

export const AsyncERef = (e: EL): $E_R => {
  return {}
}

export const AsyncE: (e: EL) => $E = (e: EL) => {
  return {
    ...AsyncECall(e),
    ...AsyncEWatch(e),
    ...AsyncERef(e),
  }
}
