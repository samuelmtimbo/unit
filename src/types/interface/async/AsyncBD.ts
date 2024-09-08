import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { BD } from '../BD'
import { $BD, $BD_C, $BD_G, $BD_R, $BD_W } from './$BD'
import { $BS } from './$BS'

export const AsyncBDGet = (device: BD): $BD_G => ({
  $captureStream: function (
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBDCall = (device: BD): $BD_C => {
  return {}
}

export const AsyncBDWatch = (device: BD): $BD_W => {
  return {}
}

export const AsyncBDRef = (device: BD): $BD_R => ({
  $getServer: function (data: {}): $BS {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBD = (device: BD): $BD => {
  return {
    ...AsyncBDGet(device),
    ...AsyncBDCall(device),
    ...AsyncBDWatch(device),
    ...AsyncBDRef(device),
  }
}
