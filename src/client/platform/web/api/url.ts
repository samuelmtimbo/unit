import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webURL(window: Window, opt: BootOpt): API['url'] {
  const url = {
    createObjectURL: async function (
      object: Blob | MediaSource
    ): Promise<string> {
      return URL.createObjectURL(object)
    },
  }

  return url
}
