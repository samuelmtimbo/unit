import { API } from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt } from '../../../../system'
import {
  IHTTPServer,
  IHTTPServerOpt,
} from '../../../../types/global/IHTTPServer'
import { Unlisten } from '../../../../types/Unlisten'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const HTTPServer = (opt: IHTTPServerOpt): IHTTPServer => {
    return {
      listen(port: number): Unlisten {
        return NOOP
      },
    }
  }

  // TODO
  const http = {
    server: {
      local: HTTPServer,
      cloud: HTTPServer,
    },
    fetch: fetch,
  }

  return http
}
