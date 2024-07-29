import { API } from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const http = {
    fetch,
    listen: (port: number, handler: (req) => Promise<any>): Unlisten => {
      return NOOP
    },
    // @ts-ignore
    EventSource: window.EventSource,
  }

  return http
}
