import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webScreen(window: Window, opt: BootOpt): API['screen'] {
  async function request(type?: 'screen'): Promise<WakeLockSentinel> {
    return await window.navigator.wakeLock.request('screen')
  }

  const screen: API['screen'] = {
    wakeLock: {
      request,
    },
  }

  return screen
}
