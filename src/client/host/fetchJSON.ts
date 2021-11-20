import { fetchJSON, FetchJSONOpt } from '../fetch'

export const getAuthToken = (): string => {
  return 'TODO'
}

export const requestJSON = (
  hostname: string,
  options: FetchJSONOpt = {}
): Promise<any> => {
  const authToken = getAuthToken()
  const { method, data, headers } = options
  return fetchJSON(hostname, {
    method,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...headers,
    },
    data,
  })
}
