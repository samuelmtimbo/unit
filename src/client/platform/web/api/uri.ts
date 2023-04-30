import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webURI(window: Window, opt: BootOpt): API['uri'] {
  // @ts-ignore
  const { encodeURI } = window

  const url = {
    encodeURI: function (str: string): string {
      return encodeURI(str)
    },
    encodeURIComponent: function (str: string): string {
      return encodeURIComponent(str)
    },
  }

  return url
}
