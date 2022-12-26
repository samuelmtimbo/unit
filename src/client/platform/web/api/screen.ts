import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { API, BootOpt } from '../../../../system'
import { IWakeLock } from '../../../../types/global/IWakeLock'

export function webScreen(window: Window, opt: BootOpt): API['screen'] {
  async function requestWakeLock(): Promise<IWakeLock> {
    throw new APINotSupportedError('Screen Wake Lock')
  }

  const screen = {
    requestWakeLock,
  }

  return screen
}
