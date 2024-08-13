import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'

export function __intercept__fetch(
  fetch: (input: string, init?: RequestInit) => Promise<Response>
) {
  return async (input: string, init: RequestInit, servers: Dict<any>) => {
    if (input.startsWith('unit://')) {
      let _input = input.replace('unit://', 'http://')

      const url = new URL(_input)

      const { port, search } = url

      const handler = servers[port || 8080]

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
  listen: (port: number, handler: (req) => Promise<any>) => Unlisten
) {
  return (
    port: number,
    handler: (req) => Promise<any>,
    servers: Dict<any>
  ): Unlisten => {
    if (servers[port]) {
      throw new Error(`port ${port} is already in use`)
    }

    servers[port] = handler

    const unlisten = listen(port, handler)

    return () => {
      delete servers[port]

      unlisten()
    }
  }
}
