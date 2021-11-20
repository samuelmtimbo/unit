import isIp = require('is-ip')
import { isLocalHost } from '../../localhost'

export function getDocumentCookieByName(name: string): string {
  const _name = name + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(_name) === 0) {
      return c.substring(_name.length, c.length)
    }
  }
  return ''
}

export function deleteCookie(name: string): void {
  const { hostname } = location
  let Domain: string
  if (isLocalHost(hostname) || isIp(hostname)) {
    Domain = hostname
  } else {
    Domain = 'ioun.it'
  }
  const cookie = `${name}= ; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Domain=${Domain}`
  document.cookie = cookie
}
