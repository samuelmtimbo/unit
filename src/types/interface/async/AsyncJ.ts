import { evaluate } from '../../../spec/evaluate'
import { Callback } from '../../Callback'
import { J } from '../J'
import { $J, $J_C, $J_G, $J_R, $J_W } from './$J'

export const AsyncJGet: (value: J) => $J_G = (value) => {
  return {
    $get({ name }: { name: string }, callback: Callback<any>): void {
      ;(async () => {
        let data: any

        try {
          data = await value.get(name)
        } catch (err) {
          callback(undefined, err.message)
        }
        callback(data)
      })()
    },
  }
}

export const AsyncJCall: (value: J) => $J_C = (value) => {
  return {
    $set(
      { name, data }: { name: string; data: string },
      callback: Callback<any>
    ): void {
      ;(async () => {
        try {
          const _data = evaluate(data, {}, {})

          await value.set(name, _data)
        } catch (err) {
          callback(undefined, err.message)
        }

        callback()
      })()
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
    ...AsyncJGet(value),
    ...AsyncJCall(value),
    ...AsyncJWatch(value),
    ...AsyncJRef(value),
  }
}
