import { Callback } from '../../Callback'
import { AB } from '../AB'
import { $AB, $AB_C, $AB_G, $AB_R, $AB_W } from './$AB'

export const AsyncABGet = (buffer: AB): $AB_G => ({
  $arrayBuffer: function (data: {}, callback: Callback<ArrayBuffer>): void {
    void (async () => {
      const buffer_ = await buffer.arrayBuffer()

      callback(buffer_)
    })()
  },
})

export const AsyncABCall = (buffer: AB): $AB_C => ({})

export const AsyncABWatch = (buffer: AB): $AB_W => {
  return {}
}

export const AsyncABRef = (buffer: AB): $AB_R => ({})

export const AsyncAB = (buffer: AB): $AB => {
  return {
    ...AsyncABGet(buffer),
    ...AsyncABCall(buffer),
    ...AsyncABWatch(buffer),
    ...AsyncABRef(buffer),
  }
}
