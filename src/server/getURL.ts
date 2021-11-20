import isIP = require('is-ip')
import { isLocalHost } from '../client/localhost'
import { PORT } from './port'
// import assert = require('assert')

export const getURL = (
  hostname: string,
  path: string,
  collapse: boolean = false
): string => {
  let segments = path.split('/').slice(1)

  if (isLocalHost(hostname) || isIP(hostname)) {
    return `http://${hostname}:${PORT}${
      segments.length > 0 ? `/${segments.join('/')}` : ''
    }`
  } else {
    if (collapse) {
      return `https://${segments.length > 2 ? `${segments[2]}.` : ''}${
        segments[0]
      }.${segments[1]}${
        segments.length > 3 ? `/${segments.slice(3).join('/')}` : ''
      }`
    } else {
      const hostname_segments = hostname.split('.')
      const hostname_segments_l = hostname_segments.length

      if (hostname_segments_l === 3) {
        if (hostname_segments[0] === segments[2]) {
          return `https://${hostname}${
            segments.length > hostname_segments_l
              ? `/${segments.slice(3).join('/')}`
              : ''
          }`
        } else {
          const _hostname = `${hostname_segments[hostname_segments_l - 2]}.${
            hostname_segments[hostname_segments_l - 1]
          }`

          return `https://${_hostname}${
            segments.length > hostname_segments_l
              ? `/${segments.slice(2).join('/')}`
              : ''
          }`
        }
      } else {
        return `https://${hostname}${
          segments.length > hostname_segments_l
            ? `/${segments.slice(2).join('/')}`
            : ''
        }`
      }
    }
  }
}

// console.log(getURL('ioun.it', '/ioun/it/id/signin', true))
// console.log(getURL('ioun.it', '/ioun/it/id/forgot/email', true))
// console.log(getURL('ioun.it', '/ioun/it/id/signin', false))
// console.log(getURL('app.ioun.it', '/ioun/it/app', false))
// console.log(getURL('signin.ioun.one', '/ioun/one/forgot/email', false))
// console.log(getURL('localhost', '/ioun/it/id/signin', false))
// assert(
//   getURL('ioun.it', '/ioun/it/id/signin', true) === 'https://id.ioun.it/signin'
// )
// assert(
//   getURL('ioun.it', '/ioun/it/id/signin', false) === 'https://ioun.it/id/signin'
// )
// assert(
//   getURL('ioun.it', '/ioun/it/id/forgot/email', true) ===
//     'https://id.ioun.it/forgot/email'
// )
// assert(getURL('app.ioun.it', '/ioun/it/app', false) === 'https://app.ioun.it')
// assert(
//   getURL('signin.ioun.one', '/ioun/one/forgot/email', false) ===
//     'https://ioun.one/forgot/email'
// )
// assert(
//   getURL('localhost', '/ioun/it/id/signin', false) ===
//     'http://localhost:5000/ioun/it/id/signin'
// )
