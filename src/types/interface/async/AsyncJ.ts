import { $ } from '../../../Class/$'
import { evaluate } from '../../../spec/evaluate'
import { Callback } from '../../Callback'
import { J } from '../J'
import { $J, $J_C, $J_G, $J_R, $J_W } from './$J'
import { Async } from './Async'

export const AsyncJGet: (value: J) => $J_G = (value) => {
  return {
    $get({ name }: { name: string }, callback: Callback<any>): void {
      let data: any

      try {
        data = value.get(name)
      } catch (err) {
        callback(undefined, err.message)
      }
      callback(data)
    },
  }
}

export const AsyncJCall: (value: J) => $J_C = (value) => {
  return {
    $set(
      { name, data }: { name: string; data: string },
      callback: Callback<any>
    ): void {
      try {
        const _data = evaluate(data, {}, {})

        value.set(name, _data)
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
  return {
    $ref({ name }: { name: string }): any {
      let obj: any

      try {
        obj = value.get(name)
      } catch (err) {
        return null
      }

      if (obj === undefined) {
        return null
      }

      if (obj instanceof $) {
        const $obj = Async(obj, obj.__, obj.__system.async)

        return $obj
      } else {
        return null
      }
    },
  }
}

export const AsyncJ: (value: J) => $J = (value: J) => {
  return {
    ...AsyncJGet(value),
    ...AsyncJCall(value),
    ...AsyncJWatch(value),
    ...AsyncJRef(value),
  }
}
