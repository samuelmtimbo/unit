import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { AB } from '../AB'
import { $AB, $AB_C, $AB_G, $AB_R, $AB_W } from './$AB'

export const AsyncABGet = (date: AB): $AB_G => ({
  $arrayBuffer: function (data: {}, callback: Callback<ArrayBuffer>): void {
    throw new MethodNotImplementedError()
  },
})

export const AsyncABCall = (date: AB): $AB_C => ({})

export const AsyncABWatch = (date: AB): $AB_W => {
  return {}
}

export const AsyncABRef = (date: AB): $AB_R => ({})

export const AsyncAB = (date: AB): $AB => {
  return {
    ...AsyncABGet(date),
    ...AsyncABCall(date),
    ...AsyncABWatch(date),
    ...AsyncABRef(date),
  }
}
