import { System } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'

export function __intercept__fetch(
  system: System,
  fetch: (input: string, init?: RequestInit) => Promise<Response>
) {
  return async (input: string, init?: RequestInit) => {
    const {
      cache: { serverMap },
    } = system

    if (input.startsWith('unit://')) {
      let _input = input.replace('unit://', 'http://')

      const url = new URL(_input)

      const { port, search } = url

      const handler = serverMap[port || 8080]

      if (!handler) {
        throw new Error('failed to fetch')
      }

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
  }
}

export function __intercept__listen(
  system: System,
  listen: (port: number, handler: (req) => Promise<any>) => Unlisten
) {
  return (port: number, handler: (req) => Promise<any>): Unlisten => {
    const {
      cache: { serverMap },
    } = system

    if (serverMap[port]) {
      throw new Error(`port ${port} is already in use`)
    }

    serverMap[port] = handler

    const unlisten = listen(port, handler)

    return () => {
      delete serverMap[port]

      unlisten()
    }
  }
}
