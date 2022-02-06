import { stringify } from '../../spec/stringify'
import { Callback } from '../../types/Callback'
import { V } from '../V'
import { $V, $V_C, $V_R, $V_W } from './$V'

export const AsyncVCall: (value: V) => $V_C = (value) => {
  return {
    async $read({}: {}, callback: Callback<any>): Promise<void> {
      let data
      try {
        data = await value.read()
      } catch (err) {
        return callback(undefined, err.message)
      }
      const _data = stringify(data)
      callback(_data)
    },

    async $write(
      { data }: { data: any },
      callback: Callback<void>
    ): Promise<any> {
      await value.write(data)
      callback()
    },
  }
}

export const AsyncVWatch: (value: V) => $V_W = (value) => {
  return {}
}

export const AsyncVRef: (value: V) => $V_R = (value) => {
  return {}
}

export const AsyncV: (value: V) => $V = (value: V) => {
  return {
    ...AsyncVCall(value),
    ...AsyncVWatch(value),
    ...AsyncVRef(value),
  }
}
