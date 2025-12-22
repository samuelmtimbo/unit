import {
  InterceptOpt,
  RequestOpt,
  ServerInterceptor,
  ServerRequest,
  ServerResponse,
} from '../../../../API'
import { Dict } from '../../../../types/Dict'

export function intercept(opt: InterceptOpt, url: string): boolean {
  const urls = Array.isArray(opt.urls) ? opt.urls : [opt.urls]

  for (const pattern of urls) {
    const regex = pattern.replace(/\*/g, '[^ ]*')

    if (url.match(new RegExp(regex))) {
      return true
    }
  }

  return false
}

export function defaultPort(url: string): string {
  let { port, protocol } = new URL(url)

  if (!port) {
    if (protocol === 'http:' || protocol === 'unit:') {
      port = '80'
    } else if (protocol === 'https:') {
      port = '443'
    }
  }

  return port
}

export function searchToQuery(search: string): Dict<string> {
  const query = Object.fromEntries(new URLSearchParams(search).entries())

  return query
}

export function requestToServerRequest(
  opt: RequestOpt,
  url: string
): ServerRequest {
  const { method = 'GET', headers = {} } = opt

  const parsedUrl = new URL(url)

  const { pathname: path, protocol, hostname, origin, search } = new URL(url)

  let { port } = parsedUrl

  if (!port) {
    if (protocol === 'http:' || protocol === 'unit:') {
      port = '80'
    } else if (protocol === 'https:') {
      port = '443'
    }
  }

  const query = searchToQuery(search)

  const { body } = new Request('', {
    method: 'POST',
    body: opt.body ?? '',
  })

  const request: ServerRequest = {
    url,
    headers,
    body,
    path,
    hostname,
    origin,
    port,
    method,
    query,
    search,
    protocol,
  }

  return request
}

export function serverResponseToResponse(res: ServerResponse): Response {
  if ([204, 304].includes(res.status)) {
    delete res.body
  }

  const response = new Response(res.body, {
    status: res.status,
    headers: res.headers,
  })

  return response
}

export function __intercept__fetch(
  fetch: (input: string, init?: RequestOpt) => Promise<Response>
) {
  return async (
    url: string,
    init: RequestOpt,
    interceptors: ServerInterceptor[]
  ) => {
    for (const interceptor of interceptors) {
      if (intercept(interceptor.opt, url)) {
        const request = requestToServerRequest(init, url)

        const serverResponse = await interceptor.handler(request)

        const response = serverResponseToResponse(serverResponse)

        return response
      }
    }

    return fetch(url, init)
  }
}
