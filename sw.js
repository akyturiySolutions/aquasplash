// ============================================================
//  Service Worker — framework version
//  Pre-caches the app shell only (HTML/CSS/JS). Images and any
//  other assets are cached on first visit via the fetch handler,
//  so this file never needs per-tenant edits.
// ============================================================

const CACHE_NAME = 'pwa-shell-v1';

// App shell only — no product images listed here on purpose.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/config.js',
  '/js/router.js',
  '/js/components/header.js',
  '/js/components/nav.js',
  '/js/pages/home.js',
  '/js/pages/products.js',
  '/js/pages/order.js',
  '/js/pages/delivery.js',
  '/js/pages/contact.js',
  '/js/pages/map.js',
  '/js/pages/about.js',
];

// ── Install: pre-cache the app shell ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first, fall back to network ────────────────
// Anything not pre-cached (product images, etc.) gets cached
// here the first time it's requested — no per-tenant edits needed.
self.addEventListener('fetch', event => {
  // Don't intercept WhatsApp / tel / external links
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache valid responses for future use
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
