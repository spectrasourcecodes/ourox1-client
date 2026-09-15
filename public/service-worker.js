// public/service-worker.js

const CACHE_NAME = 'OuroInvestX-static-v3';
const RUNTIME_CACHE = 'OuroInvestX-runtime-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );

  // Do NOT immediately force activation.
  // The page can tell the SW when it is safe to activate.
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE
          )
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navigation / HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/index.html');
          });
        })
    );

    return;
  }

  // Static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (
          response &&
          response.ok &&
          response.type === 'basic'
        ) {
          const copy = response.clone();

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, copy);
          });
        }

        return response;
      });
    })
  );
});

// Allow the application to activate a waiting SW
self.addEventListener('message', (event) => {
  if (
    event.data &&
    event.data.type === 'SKIP_WAITING'
  ) {
    self.skipWaiting();
  }
});