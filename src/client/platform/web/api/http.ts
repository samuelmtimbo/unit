import { API } from '../../../../API'
import { NOOP } from '../../../../NOOP'
import { BootOpt } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'

export function webHTTP(window: Window, opt: BootOpt): API['http'] {
  const { fetch } = window

  const serverMap = {}

  const http = {
    fetch: async (input: string, init?: RequestInit) => {
      if (input.startsWith('unit://')) {
        let _input = input.replace('unit://', 'http://')

        const url = new URL(_input)

        const { port, search } = url

        const handler = serverMap[port || 8080]

        const req = {
          headers: init.headers ?? {},
          search: search ?? '',
          query: Object.fromEntries(new URLSearchParams(search)),
          method: init.method ?? 'GET',
          path: url.pathname ?? '/',
          body: init.body ?? '',
        }

        const res = await handler(req)

        return new Response(res.body, {
          status: res.status,
          headers: res.headers,
        })
      }

      return fetch(input, init)
    },
    listen: (port: number, handler: (req) => Promise<any>): Unlisten => {
      if (serverMap[port]) {
        throw new Error(`Port ${port} is already in use`)
      }

      serverMap[port] = handler

      return NOOP
    },
    // @ts-ignore
    EventSource: window.EventSource,
  }

  return http
}
