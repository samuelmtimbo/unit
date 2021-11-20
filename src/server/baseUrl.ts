import isIP = require('is-ip')
// import * as assert from 'assert'

export const baseUrl = (hostname: string): string => {
  if (isIP(hostname)) {
    return '/'
  } else {
    let segments = hostname.split('.').reverse()
    if (segments[0] === 'localhost') {
      segments = segments.slice(1)
    } else if (segments[1] === 'ioun') {
      segments.splice(1, 1)
    }
    return `/${segments.join('/')}`
  }
}

// assert.equal(baseUrl('it.localhost'), '/it')
// assert.equal(baseUrl('app.it.localhost'), '/it/app')
// assert.equal(baseUrl('app.localhost'), '/app')
// assert.equal(baseUrl('ioun.it'), '/it')
// assert.equal(baseUrl('app.ioun.it'), '/it/app')
// assert.equal(baseUrl('ioun.app'), '/app')
// assert.equal(baseUrl('10.0.1.106'), '/')
