import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { API } from '../../../../system'

export function webDevice(window: Window, prefix: string): API['device'] {
  const device = {
    vibrate: async (pattern: VibratePattern) => {
      if (navigator.vibrate) {
        navigator.vibrate(pattern)
      } else {
        throw new APINotSupportedError('Vibrate')
      }
    },
  }

  return device
}
