/**
 * @file analytics.js
 * @description Dashboard de métricas para el panel de administración.
 *
 * TODOS los datos son reales y salen de Supabase. Si una tabla no existe,
 * está vacía o la consulta falla, esa sección muestra un estado vacío
 * ("Sin datos todavía") en vez de romper el resto del panel.
 *
 * Tablas Supabase que consume:
 *  - profiles       (status, created_at)                → usuarios / nuevos miembros
 *  - eventos        (id, titulo, fecha, aforo)          → inscripciones por evento
 *  - inscripciones  (evento_id)                         → recuento de inscritos
 *  - donaciones     (usuario_id, campana_nombre,        → total donado / campañas
 *                    cantidad, recurrente, created_at)
 *  - noticias       (id, titulo, categoria)             → catálogo de artículos
 *  - news_reads     (news_id)                           → noticias más leídas
 *  - page_views     (page)                              → visitas por sección
 *
 * DEPENDENCIAS (en orden de carga):
 *  - auth.js       → getSupabase(), getCurrentUser()
 *  - chart.js CDN  → window.Chart
 *
 * PUNTO DE ENTRADA: loadAnalyticsDashboard() — se llama desde admin.html al
 * activar la pestaña de Analíticas.
 *
 * El tracking que alimenta page_views / news_reads (trackPageView,
 * trackNewsRead) vive en js/nav.js, porque nav.js se carga en todas las
 * páginas y analytics.js solo en admin.html.
 */

'use strict';

// ─── 1. Helpers Supabase ─────────────────────────────────────────
function _anSB() {
  return typeof getSupabase === 'function' ? getSupabase() : null;
}

// ─── 2. Utilidades ───────────────────────────────────────────────

function _anEsc(str) {
  if (typeof escHtml === 'function') return escHtml(str == null ? '' : String(str));
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _fmtEur(n) {
  return Number(n || 0).toLocaleString('es-ES', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0
  });
}

function _fmtNum(n) {
  return Number(n || 0).toLocaleString('es-ES');
}

function _fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

function _pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }

function _el(id) {
  const el = document.getElementById(id);
  return el || { textContent: '', innerHTML: '', style: {} };
}

const _anCharts = {};
function _destroyChart(id) {
  if (_anCharts[id]) {
    try { _anCharts[id].destroy(); } catch (e) {}
    delete _anCharts[id];
  }
}

// Últimos 6 meses como buckets year-mes, en orden cronológico.
function _lastSixMonths() {
  const out = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: d.getFullYear() + '-' + d.getMonth(),
      label: d.toLocaleDateString('es-ES', { month: 'short' }),
      count: 0
    });
  }
  return out;
}

const _PAGE_LABELS = {
  home: 'Inicio', noticias: 'Noticias', eventos: 'Eventos', comunidad: 'Comunidad',
  donativos: 'Donativos', 'rav-hub': 'Rav Hub', rav: 'Preguntas al Rav', shiurim: 'Shiurim',
  kosher: 'Kosher', 'kosher-app': 'Kosher App', wallap: 'Wallap', servicios: 'Servicios',
  calendario: 'Calendario', mikve: 'Mikvé', perfil: 'Perfil', 'citas-rabino': 'Citas con el Rav',
  citas: 'Citas', esencial: 'Esencial', business: 'Business', professionals: 'Profesionales',
  galeria: 'Galería', siddur: 'Siddur', voluntariado: 'Voluntariado', tienda: 'Tienda',
  jconnect: 'JConnect'
};
function _pageLabel(id) { return _PAGE_LABELS[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Otra'); }

// ─── 4. Fetchers ─────────────────────────────────────────────────

async function _fetchAll() {
  const sb = _anSB();
  if (!sb) return {};

  const safe = (p) => p.then(r => r).catch(e => ({ data: null, error: e }));
  const sixAgo = new Date();
  sixAgo.setMonth(sixAgo.getMonth() - 6, 1);
  sixAgo.setHours(0, 0, 0, 0);

  const [
    profiles, eventos, inscripciones, donaciones,
    noticias, newsReads, pageViews
  ] = await Promise.all([
    safe(sb.from('profiles').select('status, created_at')),
    safe(sb.from('eventos').select('id, titulo, fecha, aforo')),
    safe(sb.from('inscripciones').select('evento_id')),
    safe(sb.from('donaciones').select('usuario_id, usuario_nombre, campana_nombre, cantidad, recurrente, created_at')),
    safe(sb.from('noticias').select('id, titulo, categoria')),
    safe(sb.from('news_reads').select('news_id')),
    safe(sb.from('page_views').select('page'))
  ]);

  return {
    profiles: profiles.data || [],
    eventos: eventos.data || [],
    inscripciones: inscripciones.data || [],
    donaciones: donaciones.data || [],
    noticias: noticias.data || [],
    newsReads: newsReads.data || [],
    pageViews: pageViews.data || [],
    _sixAgo: sixAgo
  };
}

// ─── 5. KPIs ─────────────────────────────────────────────────────

function _renderKPIs(d) {
  const activos    = d.profiles.filter(p => p.status === 'active').length;
  const pendientes = d.profiles.filter(p => p.status === 'pending').length;
  const totalUsers = d.profiles.length;
  const nuevos7d   = d.profiles.filter(p => {
    const c = new Date(p.created_at);
    return !isNaN(c) && (Date.now() - c.getTime()) < 7 * 864e5;
  }).length;

  const totalInscritos = d.inscripciones.length;
  const totalAforo     = d.eventos.reduce((s, e) => s + (Number(e.aforo) || 0), 0);

  const totalLecturas  = d.newsReads.length;

  const totalDonado    = d.donaciones.reduce((s, x) => s + (parseFloat(x.cantidad) || 0), 0);
  const donantes       = new Set(d.donaciones.map(x => x.usuario_id).filter(Boolean)).size;
  const nCampanas      = new Set(d.donaciones.map(x => x.campana_nombre).filter(Boolean)).size;

  _el('an-activos').textContent           = _fmtNum(activos);
  _el('an-activos-sub').textContent       = totalUsers + ' registrados · ' + nuevos7d + ' esta semana';
  _el('an-inscripciones').textContent     = _fmtNum(totalInscritos);
  _el('an-inscripciones-sub').textContent = d.eventos.length + ' eventos · ' + _fmtNum(totalAforo) + ' plazas';
  _el('an-lecturas').textContent          = _fmtNum(totalLecturas);
  _el('an-lecturas-sub').textContent      = d.noticias.length + ' artículos publicados';
  _el('an-donado').textContent            = _fmtEur(totalDonado);
  _el('an-donado-sub').textContent        = donantes + ' donantes · ' + nCampanas + ' campañas';

  const ts = new Date().toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  _el('an-last-updated').textContent = 'Datos reales · actualizado ' + ts;
}

// ─── 6. Lista: eventos con inscripciones ─────────────────────────

function _inscritosPorEvento(d) {
  const counts = {};
  d.inscripciones.forEach(r => {
    const k = String(r.evento_id);
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}

function _renderEventos(d) {
  const container = document.getElementById('an-eventos-list');
  if (!container) return;
  if (!d.eventos.length) {
    container.innerHTML = '<p class="an-empty" style="color:var(--color-text-muted);font-size:.82rem;padding:12px 0;">Sin eventos publicados.</p>';
    return;
  }
  const counts = _inscritosPorEvento(d);
  const rows = d.eventos
    .map(e => ({
      titulo: e.titulo || 'Evento',
      fecha: e.fecha,
      aforo: Number(e.aforo) || 0,
      inscritos: counts[String(e.id)] || 0
    }))
    .sort((a, b) => {
      const fa = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fb = b.fecha ? new Date(b.fecha).getTime() : 0;
      return fb - fa;
    })
    .slice(0, 12);

  container.innerHTML = rows.map(ev => {
    const pct = _pct(ev.inscritos, ev.aforo);
    const fillCls = pct >= 85 ? 'an-fill-danger' : pct >= 60 ? 'an-fill-warn' : 'an-fill-ok';
    const badgeCls = pct >= 85 ? 'badge badge-danger' : pct >= 60 ? 'badge badge-warning' : 'badge badge-success';
    const pctTxt = ev.aforo ? pct + '%' : '—';
    return '<div class="an-event-row">'
      + '<div class="an-event-name">' + _anEsc(ev.titulo) + '</div>'
      + '<div class="an-event-meta">'
      + '<span class="an-event-date">' + _fmtDate(ev.fecha) + '</span>'
      + '<span class="an-inscritos"><strong>' + ev.inscritos + '</strong>' + (ev.aforo ? ' / ' + ev.aforo : '') + '</span>'
      + '<div class="an-bar-wrap"><div class="an-bar-fill ' + fillCls + '" style="width:' + Math.min(pct, 100) + '%"></div></div>'
      + '<span class="' + badgeCls + '" style="font-size:.7rem;padding:2px 8px;">' + pctTxt + '</span>'
      + '</div></div>';
  }).join('');
}

// ─── 7. Lista: campañas de donación ─────────────────────────────

function _campanasAgregadas(d) {
  const map = {};
  d.donaciones.forEach(x => {
    const nombre = x.campana_nombre || 'Donativo general';
    if (!map[nombre]) map[nombre] = { nombre, total: 0, donantes: new Set(), n: 0 };
    map[nombre].total += parseFloat(x.cantidad) || 0;
    if (x.usuario_id) map[nombre].donantes.add(x.usuario_id);
    map[nombre].n += 1;
  });
  return Object.values(map)
    .map(c => ({ nombre: c.nombre, total: c.total, donantes: c.donantes.size, n: c.n }))
    .sort((a, b) => b.total - a.total);
}

function _renderDonativos(d) {
  const container = document.getElementById('an-donativos-list');
  if (!container) return;
  const camps = _campanasAgregadas(d);
  if (!camps.length) {
    container.innerHTML = '<p class="an-empty" style="color:var(--color-text-muted);font-size:.82rem;padding:12px 0;">Sin donativos todavía.</p>';
    return;
  }
  const max = camps[0].total || 1;
  container.innerHTML = camps.map(c => {
    const pct = Math.round((c.total / max) * 100);
    return '<div class="an-donation-row">'
      + '<div class="an-donation-name">' + _anEsc(c.nombre) + '</div>'
      + '<div class="an-donation-amounts">'
      + '<span class="an-amount-raised">' + _fmtEur(c.total) + '</span>'
      + '<span class="an-donation-donantes">' + c.donantes + ' donante' + (c.donantes === 1 ? '' : 's') + '</span>'
      + '<span class="an-donation-days">' + c.n + ' donativo' + (c.n === 1 ? '' : 's') + '</span>'
      + '</div>'
      + '<div class="an-bar-row">'
      + '<div class="an-bar-wrap" style="flex:1;"><div class="an-bar-fill an-fill-success" style="width:' + Math.min(pct, 100) + '%"></div></div>'
      + '<span class="an-pct-label">' + pct + '%</span>'
      + '</div></div>';
  }).join('');
}

// ─── 8. Lista: noticias más leídas ─────────────────────────────

function _lecturasPorNoticia(d) {
  const counts = {};
  d.newsReads.forEach(r => {
    const k = String(r.news_id);
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}

function _renderNoticias(d) {
  const container = document.getElementById('an-noticias-list');
  if (!container) return;
  const counts = _lecturasPorNoticia(d);

  let filas;
  if (d.noticias.length) {
    filas = d.noticias.map(n => ({
      titulo: n.titulo || 'Sin título',
      categoria: n.categoria || '',
      reads: counts[String(n.id)] || 0
    }));
  } else {
    // No hay catálogo de noticias legible: mostrar solo por id leído
    filas = Object.keys(counts).map(id => ({ titulo: 'Noticia ' + id, categoria: '', reads: counts[id] }));
  }

  filas = filas.sort((a, b) => b.reads - a.reads).slice(0, 8);

  if (!filas.length) {
    container.innerHTML = '<p class="an-empty" style="color:var(--color-text-muted);font-size:.82rem;padding:12px 0;">Sin lecturas registradas.</p>';
    return;
  }

  const eyeSVG = '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:13px;height:13px;vertical-align:-2px;margin-right:3px;opacity:.6;">'
    + '<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>'
    + '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>';

  container.innerHTML = filas.map((n, i) =>
    '<div class="an-news-row">'
    + '<span class="an-news-rank ' + (i < 3 ? 'an-rank-top' : '') + '">#' + (i + 1) + '</span>'
    + '<div class="an-news-info">'
    + '<div class="an-news-title" title="' + _anEsc(n.titulo) + '">' + _anEsc(n.titulo) + '</div>'
    + '<div class="an-news-meta">' + _anEsc(n.categoria) + '</div>'
    + '</div>'
    + '<div class="an-news-views">' + eyeSVG + _fmtNum(n.reads) + '</div>'
    + '</div>'
  ).join('');
}

// ─── 9. Gráficos ─────────────────────────────────────────────────

function _renderChartEventos(d) {
  _destroyChart('eventos');
  const canvas = document.getElementById('chart-eventos');
  if (!canvas || typeof Chart === 'undefined') return;
  const counts = _inscritosPorEvento(d);
  const evs = d.eventos
    .map(e => ({
      titulo: e.titulo || 'Evento',
      inscritos: counts[String(e.id)] || 0,
      aforo: Number(e.aforo) || 0,
      fecha: e.fecha ? new Date(e.fecha).getTime() : 0
    }))
    .sort((a, b) => b.fecha - a.fecha)
    .slice(0, 8)
    .reverse();

  _anCharts['eventos'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: evs.map(e => e.titulo.length > 20 ? e.titulo.slice(0, 20) + '…' : e.titulo),
      datasets: [
        { label: 'Inscritos', data: evs.map(e => e.inscritos), backgroundColor: 'rgba(27,46,94,0.85)', borderRadius: 5, borderSkipped: false },
        { label: 'Aforo', data: evs.map(e => e.aforo), backgroundColor: 'rgba(201,168,76,0.2)', borderColor: 'rgba(201,168,76,0.7)', borderWidth: 1.5, borderRadius: 5, borderSkipped: false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12, usePointStyle: true } },
        tooltip: { callbacks: { afterLabel(ctx) { if (ctx.datasetIndex === 0) return 'Ocupación: ' + _pct(evs[ctx.dataIndex].inscritos, evs[ctx.dataIndex].aforo) + '%'; } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, precision: 0 } }
      }
    }
  });
}

function _renderChartSecciones(d) {
  _destroyChart('secciones');
  const canvas = document.getElementById('chart-secciones');
  if (!canvas || typeof Chart === 'undefined') return;

  const counts = {};
  d.pageViews.forEach(r => { counts[r.page] = (counts[r.page] || 0) + 1; });
  const sorted = Object.entries(counts)
    .map(([page, views]) => ({ label: _pageLabel(page), views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  if (!sorted.length) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Sin visitas registradas todavía', canvas.width / 2, 40);
    return;
  }

  _anCharts['secciones'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sorted.map(s => s.label),
      datasets: [{
        label: 'Visitas',
        data: sorted.map(s => s.views),
        backgroundColor: sorted.map((_, i) => 'rgba(27,46,94,' + Math.max(0.25, 0.9 - i * 0.07) + ')'),
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label(ctx) { return ' ' + ctx.parsed.x + ' visitas'; } } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, precision: 0 } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function _renderChartUsuarios(d) {
  _destroyChart('usuarios');
  const canvas = document.getElementById('chart-usuarios');
  if (!canvas || typeof Chart === 'undefined') return;
  const activos    = d.profiles.filter(p => p.status === 'active').length;
  const pendientes = d.profiles.filter(p => p.status === 'pending').length;
  const baneados   = d.profiles.filter(p => p.status === 'banned').length;

  _anCharts['usuarios'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Activos', 'Pendientes', 'Baneados'],
      datasets: [{
        data: [activos, pendientes, baneados],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 3, borderColor: '#fff', hoverOffset: 8
      }]
    },
    options: {
      responsive: true, cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14, usePointStyle: true } },
        tooltip: { callbacks: { label(ctx) { const t = ctx.dataset.data.reduce((a, b) => a + b, 0); return ' ' + ctx.label + ': ' + ctx.parsed + (t ? ' (' + Math.round((ctx.parsed / t) * 100) + '%)' : ''); } } }
      }
    }
  });
}

function _renderChartNuevos(d) {
  _destroyChart('nuevos');
  const canvas = document.getElementById('chart-nuevos');
  if (!canvas || typeof Chart === 'undefined') return;

  const buckets = _lastSixMonths();
  const idx = {};
  buckets.forEach((b, i) => { idx[b.key] = i; });
  d.profiles.forEach(p => {
    const c = new Date(p.created_at);
    if (isNaN(c)) return;
    const k = c.getFullYear() + '-' + c.getMonth();
    if (k in idx) buckets[idx[k]].count += 1;
  });

  _anCharts['nuevos'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: buckets.map(m => m.label),
      datasets: [{
        label: 'Nuevos miembros',
        data: buckets.map(m => m.count),
        borderColor: '#1B2E5E',
        backgroundColor: 'rgba(27,46,94,0.07)',
        borderWidth: 2.5,
        pointBackgroundColor: '#1B2E5E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.38
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label(ctx) { return ' ' + ctx.parsed.y + ' nuevos miembros'; } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { stepSize: 1, font: { size: 11 }, precision: 0 } }
      }
    }
  });
}

// ─── 10. Entrada principal ───────────────────────────────────────

/**
 * Punto de entrada del dashboard de analíticas.
 * Se llama desde admin.html al activar la pestaña de Analíticas.
 * @returns {Promise<void>}
 */
async function loadAnalyticsDashboard() {
  const sb = _anSB();
  if (!sb) {
    _el('an-last-updated').textContent = 'Sin conexión a Supabase';
    return;
  }

  // Estado "cargando" en las listas
  ['an-eventos-list', 'an-donativos-list', 'an-noticias-list'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<p style="color:var(--color-text-muted);font-size:.82rem;padding:12px 0;">Cargando…</p>';
  });
  _el('an-last-updated').textContent = 'Cargando…';

  let d;
  try {
    d = await _fetchAll();
  } catch (e) {
    console.error('[analytics] fallo al cargar datos:', e);
    _el('an-last-updated').textContent = 'No se pudieron cargar los datos';
    return;
  }

  _renderKPIs(d);
  _renderEventos(d);
  _renderDonativos(d);
  _renderNoticias(d);

  // Los gráficos necesitan que el panel sea visible para medir el canvas
  setTimeout(function () {
    _renderChartEventos(d);
    _renderChartSecciones(d);
    _renderChartUsuarios(d);
    _renderChartNuevos(d);
  }, 60);
}
