(() => {
  // <define:globalThis.env>
  var NODE_ENV = "development";
  var define_globalThis_env_default = { NODE_ENV };

  // src/v.ts
  var v = 77;

  // src/client/env.ts
  var env = define_globalThis_env_default && define_globalThis_env_default.NODE_ENV || "development";
  var dev = env === "development";

  // src/client/platform/web/sw.ts
  var CACHE = `${v}`;
  var CACHE_LIST_FONT = [
    "/fonts/Inconsolata-Regular.woff2",
    "/fonts/Inconsolata-Regular.woff"
  ];
  var CACHE_LIST_FAVICON = [
    "/favicon.ico",
    "/favicon_16.png",
    "/favicon_64.png",
    "/favicon_32.png",
    "/favicon_57.png",
    "/favicon_60.png",
    "/favicon_72.png",
    "/favicon_76.png",
    "/favicon_96.png",
    "/favicon_114.png",
    "/favicon_120.png",
    "/favicon_144.png",
    "/favicon_152.png",
    "/favicon_160.png",
    "/favicon_180.png",
    "/favicon_192.png",
    "/browserconfig.xml",
    "/safari-pinned-tab.svg"
  ];
  var CACHE_LIST_MANIFEST = ["/manifest.json"];
  var CACHE_LIST_HTML = ["/", "/index.html"];
  var CACHE_LIST_INDEX_JS = [
    "/index.js",
    ...dev ? ["/index.js.map"] : []
  ];
  var CACHE_LIST = [
    ...CACHE_LIST_HTML,
    ...CACHE_LIST_INDEX_JS,
    ...CACHE_LIST_MANIFEST,
    ...CACHE_LIST_FAVICON,
    ...CACHE_LIST_FONT
  ];
  self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE).then((cache) => {
      return cache.addAll(dev ? [] : CACHE_LIST);
    }).then(() => {
      return self.skipWaiting();
    }));
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
    return self.clients.claim();
  });
  function _fetch(request) {
    return fetch(request, {
      credentials: "include"
    });
  }
  self.addEventListener("fetch", function(event) {
    const { request } = event;
    const { url } = request;
    event.respondWith(caches.match(url).then((response) => {
      if (response) {
        return response;
      } else {
        return _fetch(request);
      }
    }));
  });
})();
//# sourceMappingURL=sw.js.map
