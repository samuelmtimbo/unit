import { $ } from '../../../Class/$'
import { stringify } from '../../../spec/stringify'
import { Callback } from '../../Callback'
import { V } from '../V'
import { $V, $V_C, $V_G, $V_R, $V_W } from './$V'
import { Async } from './Async'

export const AsyncVGet: (value: V) => $V_G = (value) => {
  return {
    $read({}: {}, callback: Callback<any>): void {
      try {
        const data = value.read()

        const data_ = stringify(data)

        callback(data_)
      } catch (err) {
        callback(undefined, err.message)
      }
    },
  }
}

export const AsyncVCall: (value: V) => $V_C = (value) => {
  return {
    $write({ data }: { data: any }, callback: Callback): void {
      try {
        value.write(data)
      } catch (err) {
        callback(undefined, err)
      }
    },
  }
}

export const AsyncVWatch: (value: V) => $V_W = (value) => {
  return {}
}

export const AsyncVRef: (value: V) => $V_R = (value) => {
  return {
    $refer({ __ }: { __: string[] }) {
      const obj = value.read()

      if (obj === undefined) {
        return null
      }

      if (obj instanceof $) {
        const $obj = Async(obj, __, obj.__system.async)

        return $obj
      } else {
        return null
      }
    },
  }
}

export const AsyncV: (value: V) => $V = (value: V) => {
  return {
    ...AsyncVGet(value),
    ...AsyncVCall(value),
    ...AsyncVWatch(value),
    ...AsyncVRef(value),
  }
}
