import { Callback } from '../../types/Callback'
import { $J, $J_C, $J_R, $J_W } from './$J'

export const AsyncJCall: (value: $J) => $J_C = (value) => {
  return {
    async $get(data: { name: string }, callback: Callback<any>): Promise<any> {
      return value.$get(data, callback)
    },

    async $set(
      data: { name: string; data: any },
      callback: Callback<any>
    ): Promise<void> {
      return value.$set(data, callback)
    },
  }
}

export const AsyncJWatch: (value: $J) => $J_W = (value) => {
  return {}
}

export const AsyncJRef: (value: $J) => $J_R = (value) => {
  return {}
}

export const AsyncV: (value: $J) => $J = (value: $J) => {
  return {
    ...AsyncJCall(value),
    ...AsyncJWatch(value),
    ...AsyncJRef(value),
  }
}
