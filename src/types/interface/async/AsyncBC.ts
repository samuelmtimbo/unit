import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { BC } from '../BC'
import { $BC, $BC_C, $BC_G, $BC_R, $BC_W } from './$BC'

export const AsyncBCGet = (characteristic: BC): $BC_G => ({})

export const AsyncBCCall = (characteristic: BC): $BC_C => {
  return {}
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
