import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webDevice(window: Window, opt: BootOpt): API['device'] {
  const device = {
    vibrate: async (pattern: VibratePattern) => {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(pattern)
      } else {
        throw new APINotSupportedError('Vibrate')
      }
    },
  }

  return device
}
