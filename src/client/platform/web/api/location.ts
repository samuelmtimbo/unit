import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webLocation(window: Window, opt: BootOpt): API['location'] {
  const location = {
    async toString(): Promise<string> {
      return window.location.toString()
    },
  }

  return location
}
