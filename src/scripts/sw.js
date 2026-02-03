/* =============================
   CACHE CONFIG
   ============================= */
const CACHE_NAME = 'dicoding-story-v1';

/*
  ⚠️ PENTING:
  - DEV (webpack-dev-server) TIDAK punya bundle.js / manifest.json fisik
  - Maka cache hanya file yang PASTI ADA
*/
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

/* =============================
   PUSH NOTIFICATION
   ============================= */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.description || 'Story baru telah ditambahkan',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    data: {
      url: data.url || '/',
      storyId: data.storyId || null,
    },
    actions: [
      {
        action: 'open',
        title: 'Lihat Story',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Dicoding Story',
      options
    )
  );
});

/* =============================
   NOTIFICATION CLICK (ADVANCED)
   ============================= */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

/* =============================
   INSTALL (DEV-SAFE)
   ============================= */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        STATIC_ASSETS.map((url) =>
          fetch(url)
            .then((response) => {
              if (!response.ok) return;
              return cache.put(url, response);
            })
            .catch(() => {
              // ⛔ skip file yang tidak ada (DEV)
            })
        )
      )
    )
  );

  self.skipWaiting();
});

/* =============================
   ACTIVATE
   ============================= */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* =============================
   FETCH STRATEGY
   ============================= */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  /* =============================
     API STORIES → NETWORK FIRST
     ============================= */
  if (request.url.includes('/stories')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, cloned)
          );
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* =============================
     STATIC → CACHE FIRST
     ============================= */
  event.respondWith(
    caches.match(request).then(
      (cachedResponse) => cachedResponse || fetch(request)
    )
  );
});
