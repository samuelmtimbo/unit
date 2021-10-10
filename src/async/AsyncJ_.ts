import { Callback } from '../Callback'
import { J } from '../interface/J'
import { $J, $J_C, $J_R, $J_W } from './$J'

export const AsyncJCall: (value: J) => $J_C = (value) => {
  return {
    async $get(
      { name }: { name: string },
      callback: Callback<any>
    ): Promise<void> {
      try {
        const data = await value.get(name)
        callback(data)
      } catch (err) {
        callback(undefined, err.message)
      }
    },

    async $set(
      { name, data }: { name: string; data: any },
      callback: Callback<any>
    ): Promise<void> {
      try {
        await value.set(name, data)
        callback()
      } catch (err) {
        callback(undefined, err.message)
      }
    },
  }
}

export const AsyncJWatch: (value: J) => $J_W = (value) => {
  return {}
}

export const AsyncJRef: (value: J) => $J_R = (value) => {
  return {}
}

export const AsyncJ: (value: J) => $J = (value: J) => {
  return {
    ...AsyncJCall(value),
    ...AsyncJWatch(value),
    ...AsyncJRef(value),
  }
}
