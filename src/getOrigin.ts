import isIP = require('is-ip')
import { isLocalHost } from './client/localhost'
import { PORT } from './server/port'

export const getOrigin = (
  hostname: string,
  path: string,
  collapse: boolean = false
): string => {
  let segments = path.split('/').slice(1)
  if (isLocalHost(hostname) || isIP(hostname)) {
    return `http://${hostname}:${PORT}`
  } else {
    if (collapse) {
      return `https://${segments.length > 1 ? `${segments[1]}.` : ''}ioun.${
        segments[0]
      }`
    } else {
      return `https://ioun.${segments[0]}`
    }
  }
}
