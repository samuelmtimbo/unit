import { assert } from './assert'

function matchesUrlPatterns(url, patterns) {
  // Validate the URL
  let parsedUrl

  try {
    parsedUrl = new URL(url)
  } catch (e) {
    return false // Invalid URL
  }

  // Helper to match a pattern against a URL
  const matchesPattern = (pattern) => {
    try {
      const patternUrl = new URL(pattern.replace('*', 'example'))
      const scheme = pattern.startsWith('*://')
        ? '*'
        : patternUrl.protocol.slice(0, -1)
      const domain = patternUrl.hostname.replace('example', '*')
      const path = patternUrl.pathname.replace('example', '*')

      // Match scheme
      if (scheme !== '*' && scheme !== parsedUrl.protocol.slice(0, -1)) {
        return false
      }

      // Match domain with wildcards
      const domainRegex = new RegExp(
        '^' + domain.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
      )
      if (!domainRegex.test(parsedUrl.hostname)) {
        return false
      }

      // Match path with wildcards
      const pathRegex = new RegExp(
        '^' + path.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
      )
      if (!pathRegex.test(parsedUrl.pathname)) {
        return false
      }

      return true
    } catch (e) {
      return false // Invalid pattern
    }
  }

  // Check each pattern
  for (const pattern of patterns) {
    if (matchesPattern(pattern)) {
      return true
    }
  }

  return false
}

assert.equal(
  matchesUrlPatterns('https://example.com/resource', ['*://*.example.com/*']),
  true,
  'Test 1 failed: Should match a wildcard domain and path.'
)

assert.equal(
  matchesUrlPatterns('https://example.com/resource', [
    'https://example.com/resource',
  ]),
  true,
  'Test 2 failed: Should match an exact URL.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', [
    'https://example.com/resource',
  ]),
  false,
  'Test 3 failed: Should not match if schemes differ.'
)

assert.equal(
  matchesUrlPatterns('http://sub.example.com/resource', [
    'http://*.example.com/*',
  ]),
  true,
  'Test 4 failed: Should match subdomains with wildcard.'
)

assert.equal(
  matchesUrlPatterns('http://otherdomain.com/resource', [
    'http://*.example.com/*',
  ]),
  false,
  'Test 5 failed: Should not match unrelated domains.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', [
    'http://example.com/resource',
  ]),
  true,
  'Test 6 failed: Should match exact resource path.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource/sub', [
    'http://example.com/*',
  ]),
  true,
  'Test 7 failed: Should match any path under the domain.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', [
    'https://other.com/*',
    'http://example.com/*',
  ]),
  true,
  'Test 8 failed: Should match one of multiple patterns.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', [
    'https://other.com/*',
    'https://example.com/*',
  ]),
  false,
  'Test 9 failed: Should return false if no patterns match.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', ['*://example.com/*']),
  true,
  'Test 10 failed: Should match wildcard scheme.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', []),
  false,
  'Test 11 failed: Should return false if no patterns are provided.'
)

assert.equal(
  matchesUrlPatterns('https://sub.example.com/path/to/resource', [
    '*://*.example.com/path/*',
  ]),
  true,
  'Test 12 failed: Should match complex path and subdomain structure.'
)

assert.equal(
  matchesUrlPatterns('', ['*://*.example.com/*']),
  false,
  'Test 13 failed: Should throw error for invalid URL.'
)

assert.equal(
  matchesUrlPatterns('http://example.com/resource', ['invalid']),
  false,
  'Test 14 failed: Should handle invalid patterns gracefully.'
)
