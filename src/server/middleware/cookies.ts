import { Dict } from '../../types/Dict'

export function parseCookies(str: string): Dict<string> {
  let rx = /([^;=\s]*)=([^;]*)/g
  let obj = {}
  for (let m; (m = rx.exec(str)); ) obj[m[1]] = decodeURIComponent(m[2])
  return obj
}

export function stringifyCookies(cookies: Dict<string>): string {
  return Object.entries(cookies)
    .map(([k, v]) => k + '=' + encodeURIComponent(v))
    .join('; ')
}
