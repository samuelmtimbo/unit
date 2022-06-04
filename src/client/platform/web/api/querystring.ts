import { API } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export function webQuerystring(
  window: Window,
  prefix: string
): API['querystring'] {
  const querystring = {
    parse: (str: string): Dict<any> => {
      const urlSearchParams = new URLSearchParams(str)
      const obj = {}
      urlSearchParams.forEach((value, key) => {
        obj[key] = value
      })
      return obj
    },
    stringify: (obj: Dict<any>): string => {
      const urlSearchParams = new URLSearchParams(obj)
      const str = urlSearchParams.toString()
      return str
    },
  }

  return querystring
}
