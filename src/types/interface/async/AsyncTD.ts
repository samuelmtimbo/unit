import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { TD } from '../TD'
import { $TD, $TD_C, $TD_G, $TD_R, $TD_W } from './$TD'

export const AsyncTDGet = (date: TD): $TD_G => ({})

export const AsyncTDCall = (date: TD): $TD_C => ({
  $decode: function (
    data: TextDecodeOptions,
    callback: Callback<ArrayBuffer>
  ): void {
    throw new MethodNotImplementedError()
  },
})

export const AsyncTDWatch = (date: TD): $TD_W => {
  return {}
}

export const AsyncTDRef = (date: TD): $TD_R => ({})

export const AsyncTD = (date: TD): $TD => {
  return {
    ...AsyncTDGet(date),
    ...AsyncTDCall(date),
    ...AsyncTDWatch(date),
    ...AsyncTDRef(date),
  }
}
