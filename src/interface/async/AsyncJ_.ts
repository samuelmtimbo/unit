import { evaluate } from '../../spec/evaluate'
import { Callback } from '../../types/Callback'
import { J } from '../J'
import { $J, $J_C, $J_R, $J_W } from './$J'

export const AsyncJCall: (value: J) => $J_C = (value) => {
  return {
    async $get(
      { name }: { name: string },
      callback: Callback<any>
    ): Promise<void> {
      let data
      try {
        data = await value.get(name)
      } catch (err) {
        callback(undefined, err.message)
      }
      callback(data)
    },

    async $set(
      { name, data }: { name: string; data: string },
      callback: Callback<any>
    ): Promise<void> {
      try {
        const _data = evaluate(data, {}, {})
        await value.set(name, _data)
      } catch (err) {
        callback(undefined, err.message)
      }
      callback()
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
