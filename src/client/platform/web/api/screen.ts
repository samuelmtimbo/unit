import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { API } from '../../../../system'
import { IWakeLock } from '../../../../types/global/IWakeLock'

export function webScreen(window: Window, prefix: string): API['screen'] {
  async function requestWakeLock(): Promise<IWakeLock> {
    throw new APINotSupportedError('Screen Wake Lock')
  }

  const screen = {
    requestWakeLock,
  }

  return screen
}
