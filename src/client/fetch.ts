export type FetchJSONOpt = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  headers?: HeadersInit
}

export function fetchJSON(
  hostname: string,
  options: FetchJSONOpt = {}
): Promise<any> {
  const { method, data, headers } = options
  return fetch(hostname, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  })
}
