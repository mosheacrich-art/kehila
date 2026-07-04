/* =============================================
   Jabad Barcelona — Service Worker
   Estrategia: network-first (siempre versión más reciente)
   Push: muestra notificación nativa cuando la app está cerrada
   ============================================= */

const CACHE = 'kehila-v12';

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

// Fetch: network-first siempre
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(res => {
      // Guardar en caché solo si la respuesta es válida
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      // Sin red: usar caché como fallback
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') {
          return caches.match('/home.html');
        }
      });
    })
  );
});
