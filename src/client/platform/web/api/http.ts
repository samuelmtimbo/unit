import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const http = {
    fetch: fetch,
    // @ts-ignore
    EventSource: window.EventSource,
  }

  return http
}
