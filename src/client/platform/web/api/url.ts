import { API } from '../../../../system'

export function webURL(window: Window, prefix: string): API['url'] {
  const url = {
    createObjectURL: async function (
      object: Blob | MediaSource
    ): Promise<string> {
      return URL.createObjectURL(object)
    },
  }

  return url
}
