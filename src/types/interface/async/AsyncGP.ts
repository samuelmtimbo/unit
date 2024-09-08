import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'
import { GP } from '../GP'
import { $GP, $GP_C, $GP_G, $GP_R, $GP_W } from './$GP'

export const AsyncGPGet = (gamepad: GP): $GP_G => ({
  $captureStream: function (
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten {
    throw new MethodNotImplementedError()
  },
})

export const AsyncGPCall = (gamepad: GP): $GP_C => {
  return {}
}

export const AsyncGPWatch = (gamepad: GP): $GP_W => {
  return {}
}

export const AsyncGPRef = (gamepad: GP): $GP_R => {
  return {}
}

export const AsyncGP = (gamepad: GP): $GP => {
  return {
    ...AsyncGPGet(gamepad),
    ...AsyncGPCall(gamepad),
    ...AsyncGPWatch(gamepad),
    ...AsyncGPRef(gamepad),
  }
}
