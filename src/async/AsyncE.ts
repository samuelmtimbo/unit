import { $E, $E_C, $E_R, $E_W } from './$E'

export const AsyncECall = (e: $E_C): $E_C => {
  return {}
}

export const AsyncEWatch = (e: $E_W): $E_W => {
  return {}
}

export const AsyncERef = (e: $E_R): $E_R => {
  return {}
}

export const AsyncE: (e: $E) => $E = (e: $E) => {
  return {
    ...AsyncECall(e),
    ...AsyncEWatch(e),
    ...AsyncERef(e),
  }
}
