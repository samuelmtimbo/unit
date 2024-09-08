import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { CS } from '../CS'
import { $B } from './$B'
import { $CS_C, $CS_G, $CS_R, $CS_W } from './$CS'

export const AsyncCSGet = (captureStream: CS): $CS_G => ({
  $captureStream: function (
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten {
    throw new MethodNotImplementedError()
  },
})

export const AsyncCSCall = (captureStream: CS): $CS_C => {
  return {}
}

export const AsyncCSWatch = (captureStream: CS): $CS_W => {
  return {}
}

export const AsyncCSRef = (captureStream: CS): $CS_R => {
  return {}
}

export const AsyncCS = (captureStream: CS): $B => {
  return {
    ...AsyncCSGet(captureStream),
    ...AsyncCSCall(captureStream),
    ...AsyncCSWatch(captureStream),
    ...AsyncCSRef(captureStream),
  }
}
