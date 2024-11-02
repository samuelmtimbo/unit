declare const self: ServiceWorkerGlobalScope

import { v } from '../../../v'

const CACHE = `${v}`

const CACHE_LIST_FONT: string[] = [
  '/fonts/Inconsolata-Regular.woff2',
  '/fonts/Inconsolata-Regular.woff',
]

const CACHE_LIST_FAVICON: string[] = [
  '/favicon.ico',
  '/favicon_16.png',
  '/favicon_64.png',
  '/favicon_32.png',
  '/favicon_57.png',
  '/favicon_60.png',
  '/favicon_72.png',
  '/favicon_76.png',
  '/favicon_96.png',
  '/favicon_114.png',
  '/favicon_120.png',
  '/favicon_144.png',
  '/favicon_152.png',
  '/favicon_160.png',
  '/favicon_180.png',
  '/favicon_192.png',
  '/browserconfig.xml',
  '/safari-pinned-tab.svg',
]

const CACHE_LIST_MANIFEST: string[] = ['/manifest.json']
const CACHE_LIST_HTML: string[] = ['/', '/index.html']
const CACHE_LIST_INDEX_JS: string[] = ['/index.js', '/index.js.map']

const CACHE_LIST: string[] = [
  ...CACHE_LIST_HTML,
  ...CACHE_LIST_INDEX_JS,
  ...CACHE_LIST_MANIFEST,
  ...CACHE_LIST_FAVICON,
  ...CACHE_LIST_FONT,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => {
        return cache.addAll(CACHE_LIST)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
        )
      )
  )

  return self.clients.claim()
})

function _fetch(request) {
  return fetch(request, {
    credentials: 'include',
  })
}

self.addEventListener('fetch', function (event) {
  const { request } = event

  const { url } = request

  event.respondWith(
    caches.match(url).then((response) => {
      if (response) {
        return response
      } else {
        return _fetch(request)
      }
    })
  )
})

export type {}
