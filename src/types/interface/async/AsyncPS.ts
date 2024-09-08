import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { PS } from '../PS'
import { $PPW } from './$PPW'
import { $PS, $PS_C, $PS_G, $PS_R, $PS_W } from './$PS'

export const AsyncPSGet = (pnp: PS): $PS_G => ({})

export const AsyncPSCall = (pnp: PS): $PS_C => ({})

export const AsyncPSWatch = (pnp: PS): $PS_W => {
  return {}
}

export const AsyncPSRef = (pnp: PS): $PS_R => ({
  $requestPictureInPicture: function (data: {}): $PPW {
    throw new MethodNotImplementedError()
  },
})

export const AsyncPS = (pnp: PS): $PS => {
  return {
    ...AsyncPSGet(pnp),
    ...AsyncPSCall(pnp),
    ...AsyncPSWatch(pnp),
    ...AsyncPSRef(pnp),
  }
}
