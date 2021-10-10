import { Callback } from '../Callback'
import { $V, $V_C, $V_R, $V_W } from './$V'

export const AsyncVCall: (value: $V) => $V_C = (value) => {
  return {
    async $read(data: {}, callback: Callback<any>): Promise<any> {
      return value.$read(data, callback)
    },

    async $write(data: { data: any }, callback: Callback<void>): Promise<void> {
      return value.$write(data, callback)
    },
  }
}

export const AsyncVWatch: (value: $V) => $V_W = (value) => {
  return {}
}

export const AsyncVRef: (value: $V) => $V_R = (value) => {
  return {}
}

export const AsyncV: (value: $V) => $V = (value: $V) => {
  return {
    ...AsyncVCall(value),
    ...AsyncVWatch(value),
    ...AsyncVRef(value),
  }
}
