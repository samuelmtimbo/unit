import { stringify } from '../../../spec/stringify'
import { Callback } from '../../Callback'
import { V } from '../V'
import { $V, $V_C, $V_G, $V_R, $V_W } from './$V'

export const AsyncVGet: (value: V) => $V_G = (value) => {
  return {
    $read({}: {}, callback: Callback<any>): void {
      value.read((data, err) => {
        const data_ = stringify(data)

        callback(data_)
      })
    },
  }
}

export const AsyncVCall: (value: V) => $V_C = (value) => {
  return {
    $write({ data }: { data: any }, callback: Callback): void {
      value.write(data, callback)
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
    ...AsyncVGet(value),
    ...AsyncVCall(value),
    ...AsyncVWatch(value),
    ...AsyncVRef(value),
  }
}
