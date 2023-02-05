import { API } from '../../../../API'
import { BootOpt } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export function webQuerystring(
  window: Window,
  opt: BootOpt
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
