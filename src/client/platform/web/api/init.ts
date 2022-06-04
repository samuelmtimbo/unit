import { API } from '../../../../system'
import { _webBoot } from '../boot'

export function webInit(window: Window, prefix: string): API['init'] {
  const init = {
    boot: (root: HTMLElement) => {
      return _webBoot(window, root)
    },
  }

  return init
}
