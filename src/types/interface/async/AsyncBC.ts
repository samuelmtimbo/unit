import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { BC } from '../BC'
import { $BC, $BC_C, $BC_G, $BC_R, $BC_W } from './$BC'

export const AsyncBCGet = (characteristic: BC): $BC_G => ({
  $readValue: async function (
    {}: {},
    callback: Callback<string>
  ): Promise<void> {
    try {
      const value = await characteristic.readValue()

      callback(value)
    } catch (err) {
      callback(undefined, err.message)
    }
  },
})

export const AsyncBCCall = (characteristic: BC): $BC_C => {
  return {
    async $writeValue({ value }, callback) {
      try {
        await characteristic.writeValue(value)

        callback()
      } catch (err) {
        callback(undefined, err.message)
      }
    },
  }
}

export const AsyncBCWatch = (characteristic: BC): $BC_W => {
  return {}
}

export const AsyncBCRef = (characteristic: BC): $BC_R => ({
  $getCharacteristic: function (data: { name: string }): $BC {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBC = (characteristic: BC): $BC => {
  return {
    ...AsyncBCGet(characteristic),
    ...AsyncBCCall(characteristic),
    ...AsyncBCWatch(characteristic),
    ...AsyncBCRef(characteristic),
  }
}
