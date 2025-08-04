const CACHE_NAME = 'islamic-reminders-v3';
const urlsToCache = [
  '/islamic-reminders/',
  '/islamic-reminders/index.html',
  '/islamic-reminders/manifest.json',
  '/islamic-reminders/icons/icon-72x72.png',
  '/islamic-reminders/icons/icon-96x96.png',
  '/islamic-reminders/icons/icon-128x128.png',
  '/islamic-reminders/icons/icon-144x144.png',
  '/islamic-reminders/icons/icon-152x152.png',
  '/islamic-reminders/icons/icon-192x192.png',
  '/islamic-reminders/icons/icon-384x384.png',
  '/islamic-reminders/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный файл, если он есть
        if (response) {
          return response;
        }
        
        // Для всех запросов к нашему PWA используем сеть с fallback на index.html
        if (event.request.mode === 'navigate' || 
            (event.request.method === 'GET' && 
             event.request.headers.get('accept').includes('text/html'))) {
          return caches.match('/islamic-reminders/index.html');
        }
        
        // Для остальных запросов используем сеть
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/islamic-reminders/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/islamic-reminders/');
      }
    })
  );
});
