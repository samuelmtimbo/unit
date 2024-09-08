import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { BS } from '../BS'
import { $BS, $BS_C, $BS_G, $BS_R, $BS_W } from './$BS'
import { $BSE } from './$BSE'

export const AsyncBSGet = (server: BS): $BS_G => ({
  $captureStream: function (
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBSCall = (server: BS): $BS_C => {
  return {}
}

export const AsyncBSWatch = (server: BS): $BS_W => {
  return {}
}

export const AsyncBSRef = (server: BS): $BS_R => ({
  $getPrimaryService: function (data: {}): $BSE {
    throw new MethodNotImplementedError()
  },
})

export const AsyncBS = (server: BS): $BS => {
  return {
    ...AsyncBSGet(server),
    ...AsyncBSCall(server),
    ...AsyncBSWatch(server),
    ...AsyncBSRef(server),
  }
}
