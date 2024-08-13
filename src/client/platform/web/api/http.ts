import { API } from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt } from '../../../../system'
import { __intercept__fetch, __intercept__listen } from './intercept'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const http = {
    fetch: __intercept__fetch(fetch),
    listen: __intercept__listen(() => NOOP),
    // @ts-ignore
    EventSource: window.EventSource,
  }

  return http
}
