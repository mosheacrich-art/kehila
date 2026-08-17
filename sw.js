/* =============================================
   Jabad Barcelona — Service Worker
   Estrategia: stale-while-revalidate (responde al instante desde
   caché si existe, y actualiza esa caché en segundo plano para la
   próxima visita — evita que cada cambio de página/pestaña espere
   una ida y vuelta de red completa)
   Push: muestra notificación nativa cuando la app está cerrada
   ============================================= */

const CACHE = 'kehila-v13';

// Instalar: activar inmediatamente sin esperar
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activar: limpiar caches viejos y tomar control inmediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ─── Push: recibir notificación cuando la app está cerrada (Web PWA) ─── */
self.addEventListener('push', e => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch (_) { payload = { title: 'Jabad Barcelona', body: e.data.text() }; }

  const { title = 'Jabad Barcelona', body = '', data = {} } = payload;
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/img/icon-192.png',
      badge: '/img/icon-96.png',
      vibrate: [100, 50, 100],
      data,
      actions: [{ action: 'open', title: 'Ver' }],
    })
  );
});

/* ─── Notificationclick: abrir la app en la página correcta ─── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  const ROUTES = { evento:'eventos.html', noticia:'noticias.html', rav:'rav.html', donativo:'donativos.html', calendario:'calendario.html' };
  const destino = ROUTES[data.tipo] || 'home.html';
  const url = '/' + destino + (data.id ? '?id=' + encodeURIComponent(data.id) : '');
  e.waitUntil(clients.matchAll({ type:'window' }).then(clientList => {
    const existing = clientList.find(c => c.url.includes(destino));
    if (existing) return existing.focus();
    return clients.openWindow(url);
  }));
});

// Fetch: stale-while-revalidate — caché al instante, red en segundo plano
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') return caches.match('/home.html');
      });

      // Si hay versión en caché, responde con ella al instante y deja que
      // la petición de red actualice la caché para la próxima vez.
      return cached || network;
    })
  );
});
