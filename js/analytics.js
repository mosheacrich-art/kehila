/**
 * @file analytics.js
 * @description Dashboard de métricas para el panel de administración.
 *
 * Estrategia de datos (dos capas):
 *  1. Datos base simulados (_AN_PAGE_VIEWS_BASE, etc.) — se muestran inmediatamente
 *     para dar una UI con contenido mientras llegan los datos reales.
 *  2. Datos reales de Supabase — se suman a los base cuando lleguen.
 *     Si Supabase falla o las tablas están vacías, se conservan los datos base.
 *
 * Tablas Supabase requeridas (ver supabase_analytics.sql):
 *  - page_views  (page TEXT, user_id UUID, created_at TIMESTAMPTZ)
 *  - news_reads  (news_id TEXT, user_id UUID, created_at TIMESTAMPTZ)
 *
 * DEPENDENCIAS (en orden):
 *  - auth.js       → getSupabase(), getCurrentUser()
 *  - data.js       → MOCK_USUARIOS, MOCK_EVENTOS, MOCK_DONATIVOS, MOCK_NOTICIAS_V2
 *  - chart.js CDN  → window.Chart
 *
 * PUNTO DE ENTRADA: loadAnalyticsDashboard() — llamar desde admin.html al
 * activar la pestaña de Analytics.
 *
 * NOTA: Las KPIs de usuarios, eventos y donaciones leen de MOCK_* (data.js).
 * Cuando se complete la migración a Supabase completo, reemplazar esas referencias
 * por queries reales y eliminar data.js.
 */

'use strict';

// ─── 1. Supabase helper ───────────────────────────────────────────
function _anSB() {
  return typeof getSupabase === 'function' ? getSupabase() : null;
}

function _anUser() {
  return typeof getCurrentUser === 'function' ? getCurrentUser() : null;
}

// ─── 2. Datos base simulados ──────────────────────────────────────
//  Se usan de fallback cuando las tablas aún están vacías.
//  Cuando el tráfico real supere estos valores, se mostrarán los reales.

const _AN_PAGE_VIEWS_BASE = {
  'home':      { label: 'Inicio',      views: 453 },
  'noticias':  { label: 'Noticias',    views: 318 },
  'eventos':   { label: 'Eventos',     views: 287 },
  'comunidad': { label: 'Comunidad',   views: 193 },
  'donativos': { label: 'Donativos',   views: 152 },
  'rav-hub':   { label: 'Rav Hub',     views: 97  },
  'shiurim':   { label: 'Shiurim',     views: 89  },
  'kosher':    { label: 'Kosher App',  views: 74  },
  'wallap':    { label: 'Wallap',      views: 71  },
  'servicios': { label: 'Servicios',   views: 45  }
};

const _AN_NEWS_READS_BASE = {
  'n1': 142, 'n2': 128, 'n3': 87,
  'n4': 76,  'n5': 63,  'n6': 45,
  'n7': 38,  'n8': 31
};

const _AN_MONTHLY_MEMBERS_BASE = [
  { month: 'Nov', count: 3 }, { month: 'Dic', count: 5 },
  { month: 'Ene', count: 4 }, { month: 'Feb', count: 7 },
  { month: 'Mar', count: 9 }, { month: 'Abr', count: 6 }
];

// ─── 3. Tracking — escribe en Supabase ───────────────────────────

/**
 * Registra una visita a una sección.
 * Llamar desde cada página al cargar: trackPageView('noticias')
 * Ya se llama automáticamente desde initNav() en nav.js.
 */
async function trackPageView(page) {
  const sb = _anSB();
  if (!sb || !page) return;
  try {
    const user = _anUser();
    await sb.from('page_views').insert({
      page: page,
      user_id: user?.userId || null
    });
  } catch (e) { /* silently ignore — non-critical tracking */ }
}

/**
 * Registra que un usuario leyó una noticia.
 * Se llama automáticamente desde abrirNoticia() en noticias.js.
 */
async function trackNewsRead(newsId) {
  const sb = _anSB();
  if (!sb || !newsId) return;
  try {
    const user = _anUser();
    await sb.from('news_reads').insert({
      news_id: newsId,
      user_id: user?.userId || null
    });
  } catch (e) {}
}

// ─── 4. Fetchers de Supabase ──────────────────────────────────────

async function _fetchPageViewCounts() {
  const sb = _anSB();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('page_views').select('page');
    if (error || !data?.length) return null;
    const counts = {};
    data.forEach(r => { counts[r.page] = (counts[r.page] || 0) + 1; });
    return counts;
  } catch (e) { return null; }
}

async function _fetchNewsReadCounts() {
  const sb = _anSB();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('news_reads').select('news_id');
    if (error || !data?.length) return null;
    const counts = {};
    data.forEach(r => { counts[r.news_id] = (counts[r.news_id] || 0) + 1; });
    return counts;
  } catch (e) { return null; }
}

async function _fetchMonthlyMembers() {
  const sb = _anSB();
  if (!sb) return null;
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const { data, error } = await sb
      .from('profiles')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });
    if (error || !data?.length) return null;
    // Agrupar por mes
    const monthly = {};
    data.forEach(row => {
      const d = new Date(row.created_at);
      const key = d.toLocaleDateString('es-ES', { month: 'short' });
      monthly[key] = (monthly[key] || 0) + 1;
    });
    const result = Object.entries(monthly).map(([month, count]) => ({ month, count }));
    return result.length >= 2 ? result : null;
  } catch (e) { return null; }
}

// ─── 5. Helpers ───────────────────────────────────────────────────

function _fmtEur(n) {
  return '\u20AC\u202F' + Number(n).toLocaleString('es-ES');
}

function _fmtDate(dateStr) {
  if (!dateStr) return '\u2014';
  const parts = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return parseInt(parts[2]) + ' ' + (months[parseInt(parts[1]) - 1] || parts[1]);
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

// Combina datos reales de Supabase con los datos base simulados
function _mergeNewsReads(realCounts) {
  if (!realCounts) return _AN_NEWS_READS_BASE;
  const merged = Object.assign({}, _AN_NEWS_READS_BASE);
  Object.keys(realCounts).forEach(k => {
    merged[k] = (merged[k] || 0) + realCounts[k];
  });
  return merged;
}

function _mergePageViews(realCounts) {
  const merged = {};
  Object.keys(_AN_PAGE_VIEWS_BASE).forEach(k => {
    const real = realCounts ? (realCounts[k] || 0) : 0;
    merged[k] = { label: _AN_PAGE_VIEWS_BASE[k].label, views: _AN_PAGE_VIEWS_BASE[k].views + real };
  });
  if (realCounts) {
    Object.keys(realCounts).forEach(k => {
      if (!merged[k]) merged[k] = { label: k, views: realCounts[k] };
    });
  }
  return merged;
}

// ─── 6. KPI Cards ─────────────────────────────────────────────────

function _renderAnKPIs(newsReadCounts) {
  const users  = (typeof MOCK_USERS      !== 'undefined') ? MOCK_USERS      : [];
  const events = (typeof MOCK_EVENTOS    !== 'undefined') ? MOCK_EVENTOS    : [];
  const dons   = (typeof MOCK_DONATIVOS  !== 'undefined') ? MOCK_DONATIVOS  : [];
  const nots   = (typeof MOCK_NOTICIAS_V2 !== 'undefined') ? MOCK_NOTICIAS_V2 : [];

  const activos    = users.filter(u => u.status === 'active').length   || 5;
  const pendientes = users.filter(u => u.status === 'pending').length  || 2;
  const totalUsers = users.length || 8;

  const inscripciones = events.reduce((s, e) => s + (e.inscritos || 0), 0);
  const totalAforo    = events.reduce((s, e) => s + (e.aforo    || 0), 0);

  const reads = _mergeNewsReads(newsReadCounts);
  const totalReads = Object.values(reads).reduce((s, v) => s + v, 0);

  const totalDonado   = dons.reduce((s, d) => s + (d.actual   || 0), 0);
  const totalDonantes = dons.reduce((s, d) => s + (d.donantes || 0), 0);

  _el('an-activos').textContent           = activos;
  _el('an-activos-sub').textContent       = totalUsers + ' registrados \u00B7 ' + pendientes + ' pendientes';
  _el('an-inscripciones').textContent     = inscripciones.toLocaleString('es-ES');
  _el('an-inscripciones-sub').textContent = events.length + ' eventos \u00B7 ' + totalAforo + ' plazas totales';
  _el('an-lecturas').textContent          = totalReads.toLocaleString('es-ES');
  _el('an-lecturas-sub').textContent      = nots.length + ' art\u00EDculos publicados';
  _el('an-donado').textContent            = _fmtEur(totalDonado);
  _el('an-donado-sub').textContent        = totalDonantes + ' donantes \u00B7 ' + dons.length + ' campa\u00F1as';

  const tsEl = _el('an-last-updated');
  const ts = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  tsEl.textContent = 'Datos en tiempo real \u00B7 ' + ts;
}

// ─── 7. Tabla: Eventos con inscripciones ─────────────────────────

function _renderAnEventos() {
  const container = document.getElementById('an-eventos-list');
  if (!container) return;
  const eventos = (typeof MOCK_EVENTOS !== 'undefined') ? MOCK_EVENTOS : [];
  if (!eventos.length) { container.innerHTML = '<p class="an-empty">Sin eventos disponibles</p>'; return; }
  container.innerHTML = eventos.map(ev => {
    const pct = _pct(ev.inscritos, ev.aforo);
    const fillCls  = pct >= 85 ? 'an-fill-danger' : pct >= 60 ? 'an-fill-warn' : 'an-fill-ok';
    const badgeCls = pct >= 85 ? 'badge badge-danger' : pct >= 60 ? 'badge badge-warning' : 'badge badge-success';
    return '<div class="an-event-row">'
      + '<div class="an-event-name">' + ev.titulo + '</div>'
      + '<div class="an-event-meta">'
      + '<span class="an-event-date">' + _fmtDate(ev.fecha) + '</span>'
      + '<span class="an-inscritos"><strong>' + ev.inscritos + '</strong> / ' + ev.aforo + '</span>'
      + '<div class="an-bar-wrap"><div class="an-bar-fill ' + fillCls + '" style="width:' + Math.min(pct, 100) + '%"></div></div>'
      + '<span class="' + badgeCls + '" style="font-size:.7rem;padding:2px 8px;">' + pct + '%</span>'
      + '</div></div>';
  }).join('');
}

// ─── 8. Tabla: Campañas de donación ───────────────────────────────

function _renderAnDonativos() {
  const container = document.getElementById('an-donativos-list');
  if (!container) return;
  const dons = (typeof MOCK_DONATIVOS !== 'undefined') ? MOCK_DONATIVOS : [];
  if (!dons.length) { container.innerHTML = '<p class="an-empty">Sin campa\u00F1as activas</p>'; return; }
  container.innerHTML = dons.map(d => {
    const pct = _pct(d.actual, d.meta);
    const fillCls = pct >= 80 ? 'an-fill-success' : pct >= 50 ? 'an-fill-warn' : 'an-fill-ok';
    return '<div class="an-donation-row">'
      + '<div class="an-donation-name">' + d.titulo + '</div>'
      + '<div class="an-donation-amounts">'
      + '<span class="an-amount-raised">' + _fmtEur(d.actual) + '</span>'
      + '<span class="an-amount-goal">de ' + _fmtEur(d.meta) + '</span>'
      + '<span class="an-donation-donantes">' + d.donantes + ' donantes</span>'
      + '<span class="an-donation-days">' + d.diasRestantes + 'd restantes</span>'
      + '</div>'
      + '<div class="an-bar-row">'
      + '<div class="an-bar-wrap" style="flex:1;"><div class="an-bar-fill ' + fillCls + '" style="width:' + Math.min(pct, 100) + '%"></div></div>'
      + '<span class="an-pct-label">' + pct + '%</span>'
      + '</div></div>';
  }).join('');
}

// ─── 9. Tabla: Noticias más leídas ────────────────────────────────

function _renderAnNoticias(newsReadCounts) {
  const container = document.getElementById('an-noticias-list');
  if (!container) return;
  const reads = _mergeNewsReads(newsReadCounts);
  const noticias = (typeof MOCK_NOTICIAS_V2 !== 'undefined') ? MOCK_NOTICIAS_V2 : [];
  const sorted = noticias
    .map(n => Object.assign({}, n, { totalReads: reads[n.id] || 0 }))
    .sort((a, b) => b.totalReads - a.totalReads);
  const eyeSVG = '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:13px;height:13px;vertical-align:-2px;margin-right:3px;opacity:.6;">'
    + '<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>'
    + '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>';
  container.innerHTML = sorted.map((n, i) =>
    '<div class="an-news-row">'
    + '<span class="an-news-rank ' + (i < 3 ? 'an-rank-top' : '') + '">#' + (i + 1) + '</span>'
    + '<div class="an-news-info">'
    + '<div class="an-news-title" title="' + n.titulo + '">' + n.titulo + '</div>'
    + '<div class="an-news-meta">' + n.categoria + (n.isPinned ? ' &nbsp;\u00B7&nbsp; \uD83D\uDCCC' : '') + '</div>'
    + '</div>'
    + '<div class="an-news-views">' + eyeSVG + n.totalReads.toLocaleString('es-ES') + '</div>'
    + '</div>'
  ).join('');
}

// ─── 10. Charts ───────────────────────────────────────────────────

function _renderChartEventos() {
  _destroyChart('eventos');
  const canvas = document.getElementById('chart-eventos');
  if (!canvas || typeof Chart === 'undefined') return;
  const ev = (typeof MOCK_EVENTOS !== 'undefined') ? MOCK_EVENTOS : [];
  const labels    = ev.map(e => e.titulo.length > 20 ? e.titulo.slice(0, 20) + '\u2026' : e.titulo);
  const inscritos = ev.map(e => e.inscritos || 0);
  const aforos    = ev.map(e => e.aforo    || 0);
  _anCharts['eventos'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Inscritos', data: inscritos, backgroundColor: 'rgba(27,46,94,0.85)', borderRadius: 5, borderSkipped: false },
        { label: 'Aforo',     data: aforos,    backgroundColor: 'rgba(201,168,76,0.2)', borderColor: 'rgba(201,168,76,0.7)', borderWidth: 1.5, borderRadius: 5, borderSkipped: false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12, usePointStyle: true } },
        tooltip: { callbacks: { afterLabel(ctx) { if (ctx.datasetIndex === 0) return 'Ocupaci\u00F3n: ' + _pct(inscritos[ctx.dataIndex], aforos[ctx.dataIndex]) + '%'; } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function _renderChartSecciones(pageViewCounts) {
  _destroyChart('secciones');
  const canvas = document.getElementById('chart-secciones');
  if (!canvas || typeof Chart === 'undefined') return;
  const merged = _mergePageViews(pageViewCounts);
  const sorted = Object.values(merged).sort((a, b) => b.views - a.views);
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
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function _renderChartUsuarios() {
  _destroyChart('usuarios');
  const canvas = document.getElementById('chart-usuarios');
  if (!canvas || typeof Chart === 'undefined') return;
  const users      = (typeof MOCK_USERS !== 'undefined') ? MOCK_USERS : [];
  const activos    = users.filter(u => u.status === 'active').length  || 5;
  const pendientes = users.filter(u => u.status === 'pending').length || 2;
  const baneados   = users.filter(u => u.status === 'banned').length  || 1;
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
        tooltip: { callbacks: { label(ctx) { const t = ctx.dataset.data.reduce((a, b) => a + b, 0); return ' ' + ctx.label + ': ' + ctx.parsed + ' (' + Math.round((ctx.parsed / t) * 100) + '%)'; } } }
      }
    }
  });
}

function _renderChartNuevos(monthlyData) {
  _destroyChart('nuevos');
  const canvas = document.getElementById('chart-nuevos');
  if (!canvas || typeof Chart === 'undefined') return;
  const data = (monthlyData && monthlyData.length >= 2) ? monthlyData : _AN_MONTHLY_MEMBERS_BASE;
  _anCharts['nuevos'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(m => m.month),
      datasets: [{
        label: 'Nuevos miembros',
        data: data.map(m => m.count),
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
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { stepSize: 1, font: { size: 11 } } }
      }
    }
  });
}

// ─── 11. Función principal ────────────────────────────────────────

/**
 * Punto de entrada principal del dashboard de analytics.
 * Renderiza inmediatamente con datos fallback y luego actualiza con datos reales.
 * Llamar desde admin.html al activar la pestaña de Analytics.
 *
 * @returns {Promise<void>}
 */
async function loadAnalyticsDashboard() {
  // 1. Render inmediato con datos mock/fallback
  _renderAnKPIs(null);
  _renderAnEventos();
  _renderAnDonativos();
  _renderAnNoticias(null);
  setTimeout(function () {
    _renderChartEventos();
    _renderChartSecciones(null);
    _renderChartUsuarios();
    _renderChartNuevos(null);
  }, 60);

  // 2. Fetch datos reales de Supabase en paralelo
  try {
    const [pageViews, newsReads, monthlyMembers] = await Promise.all([
      _fetchPageViewCounts(),
      _fetchNewsReadCounts(),
      _fetchMonthlyMembers()
    ]);

    // 3. Actualizar UI con datos reales cuando lleguen
    if (newsReads) {
      _renderAnKPIs(newsReads);
      _renderAnNoticias(newsReads);
    }
    setTimeout(function () {
      if (pageViews)        _renderChartSecciones(pageViews);
      if (monthlyMembers)   _renderChartNuevos(monthlyMembers);
    }, 50);
  } catch (e) {
    console.warn('[Analytics] Supabase fetch failed, using simulated data:', e);
  }
}
