import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { TE } from '../TE'
import { $TE, $TE_C, $TE_G, $TE_R, $TE_W } from './$TE'

export const AsyncTEGet = (date: TE): $TE_G => ({})

export const AsyncTECall = (date: TE): $TE_C => ({
  $encode: function (
    data: { opt: {}; text: string | ArrayBuffer },
    callback: Callback<Uint8Array>
  ): void {
    throw new MethodNotImplementedError()
  },
})

export const AsyncTEWatch = (date: TE): $TE_W => {
  return {}
}

export const AsyncTERef = (date: TE): $TE_R => ({})

export const AsyncTE = (date: TE): $TE => {
  return {
    ...AsyncTEGet(date),
    ...AsyncTECall(date),
    ...AsyncTEWatch(date),
    ...AsyncTERef(date),
  }
}
