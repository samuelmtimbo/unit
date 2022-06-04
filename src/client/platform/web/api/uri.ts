import { API } from '../../../../system'

export function webURI(window: Window, prefix: string): API['uri'] {
  // @ts-ignore
  const { encodeURI } = window

  const url = {
    encodeURI: function (str: string): string {
      return encodeURI(str)
    },
  }

  return url
}
