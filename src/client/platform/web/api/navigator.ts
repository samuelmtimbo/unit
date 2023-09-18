import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webNavigator(window: Window, opt: BootOpt): API['navigator'] {
  const { navigator } = window

  const _navigator: API['navigator'] = {
    share: async (opt: ShareData) => {
      if (navigator.share) {
        await navigator.share(opt)
      } else {
        throw new APINotSupportedError('Share')
      }
    },
  }

  return _navigator
}
