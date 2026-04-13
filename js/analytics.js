/* ═══════════════════════════════════════════════════════════════
   KEHILÁ ANALYTICS — js/analytics.js
   Módulo de analíticas para el panel de administración.
   Utiliza datos mock de data.js + tracking vía localStorage.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── 1. Almacenamiento ────────────────────────────────────────────
const ANALYTICS_KEY = 'kehila_analytics_v1';

function _anGetStore() {
  try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}'); }
  catch (e) { return {}; }
}
function _anSaveStore(data) {
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data)); }
  catch (e) {}
}

// ─── 2. Datos base simulados (demo) ──────────────────────────────
//  Se reemplazarán por datos reales de Supabase en producción.

const _AN_PAGE_VIEWS = {
  'inicio':     { label: 'Inicio',      views: 453 },
  'noticias':   { label: 'Noticias',    views: 318 },
  'eventos':    { label: 'Eventos',     views: 287 },
  'comunidad':  { label: 'Comunidad',   views: 193 },
  'donativos':  { label: 'Donativos',   views: 152 },
  'rav-hub':    { label: 'Rav Hub',     views: 97  },
  'shiurim':    { label: 'Shiurim',     views: 89  },
  'kosher':     { label: 'Kosher App',  views: 74  },
  'wallap':     { label: 'Wallap',      views: 71  },
  'servicios':  { label: 'Servicios',   views: 45  }
};

const _AN_NEWS_READS_BASE = {
  'n1': 142, 'n2': 128, 'n3': 87,
  'n4': 76,  'n5': 63,  'n6': 45,
  'n7': 38,  'n8': 31
};

const _AN_MONTHLY_MEMBERS = [
  { month: 'Nov', count: 3 },
  { month: 'Dic', count: 5 },
  { month: 'Ene', count: 4 },
  { month: 'Feb', count: 7 },
  { month: 'Mar', count: 9 },
  { month: 'Abr', count: 6 }
];

// ─── 3. Funciones de tracking ─────────────────────────────────────
//  Llama estas funciones desde otras páginas para registrar eventos.

/** Registra una visita a una sección. page = 'noticias', 'eventos', etc. */
function trackPageView(page) {
  const store = _anGetStore();
  if (!store.views) store.views = {};
  store.views[page] = (store.views[page] || 0) + 1;
  _anSaveStore(store);
}

/** Registra que un usuario leyó una noticia. */
function trackNewsRead(newsId) {
  const store = _anGetStore();
  if (!store.newsReads) store.newsReads = {};
  store.newsReads[newsId] = (store.newsReads[newsId] || 0) + 1;
  _anSaveStore(store);
}

/** Registra que un usuario vio los detalles de un evento. */
function trackEventView(eventId) {
  const store = _anGetStore();
  if (!store.eventViews) store.eventViews = {};
  store.eventViews[eventId] = (store.eventViews[eventId] || 0) + 1;
  _anSaveStore(store);
}

// ─── 4. Helpers internos ──────────────────────────────────────────

function _fmtEur(n) {
  return '€\u202f' + Number(n).toLocaleString('es-ES');
}

function _fmtDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return parseInt(d) + ' ' + (months[parseInt(m) - 1] || m);
}

function _pct(a, b) {
  return b > 0 ? Math.round((a / b) * 100) : 0;
}

// Chart.js instances — los destruimos antes de recrear
const _anCharts = {};
function _destroyChart(id) {
  if (_anCharts[id]) { try { _anCharts[id].destroy(); } catch(e){} delete _anCharts[id]; }
}

// Fusiona datos simulados con tracking real de localStorage
function _getMergedNewsReads() {
  const tracked = (_anGetStore().newsReads || {});
  const merged = Object.assign({}, _AN_NEWS_READS_BASE);
  Object.keys(tracked).forEach(k => { merged[k] = (merged[k] || 0) + tracked[k]; });
  return merged;
}

function _getMergedPageViews() {
  const tracked = (_anGetStore().views || {});
  const result = {};
  Object.keys(_AN_PAGE_VIEWS).forEach(k => {
    result[k] = {
      label: _AN_PAGE_VIEWS[k].label,
      views: _AN_PAGE_VIEWS[k].views + (tracked[k] || 0)
    };
  });
  return result;
}

// ─── 5. KPI Cards ─────────────────────────────────────────────────

function _renderAnKPIs() {
  const users  = (typeof MOCK_USERS !== 'undefined') ? MOCK_USERS : [];
  const events = (typeof MOCK_EVENTOS !== 'undefined') ? MOCK_EVENTOS : [];
  const dons   = (typeof MOCK_DONATIVOS !== 'undefined') ? MOCK_DONATIVOS : [];

  const activos    = users.filter(u => u.status === 'active').length || 5;
  const pendientes = users.filter(u => u.status === 'pending').length || 2;
  const totalUsers = users.length || 8;

  const inscripciones = events.reduce((s, e) => s + (e.inscritos || 0), 0);
  const totalAforo    = events.reduce((s, e) => s + (e.aforo || 0), 0);

  const reads = _getMergedNewsReads();
  const totalReads = Object.values(reads).reduce((s, v) => s + v, 0);
  const noticias = (typeof MOCK_NOTICIAS_V2 !== 'undefined') ? MOCK_NOTICIAS_V2 : [];

  const totalDonado   = dons.reduce((s, d) => s + (d.actual || 0), 0);
  const totalDonantes = dons.reduce((s, d) => s + (d.donantes || 0), 0);

  _el('an-activos').textContent      = activos;
  _el('an-activos-sub').textContent  = totalUsers + ' registrados · ' + pendientes + ' pendientes';
  _el('an-inscripciones').textContent     = inscripciones.toLocaleString('es-ES');
  _el('an-inscripciones-sub').textContent = events.length + ' eventos · ' + totalAforo + ' plazas totales';
  _el('an-lecturas').textContent     = totalReads.toLocaleString('es-ES');
  _el('an-lecturas-sub').textContent = noticias.length + ' artículos publicados';
  _el('an-donado').textContent       = _fmtEur(totalDonado);
  _el('an-donado-sub').textContent   = totalDonantes + ' donantes · ' + dons.length + ' campañas';

  // Fecha de actualización
  const now = new Date();
  const ts = now.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
  const el = _el('an-last-updated');
  if (el) el.textContent = 'Actualizado ' + ts;
}

function _el(id) {
  return document.getElementById(id) || { textContent: '' };
}

// ─── 6. Tabla: Eventos con inscripciones ──────────────────────────

function _renderAnEventos() {
  const container = document.getElementById('an-eventos-list');
  if (!container) return;

  const eventos = (typeof MOCK_EVENTOS !== 'undefined') ? MOCK_EVENTOS : [];
  if (!eventos.length) {
    container.innerHTML = '<p class="an-empty">Sin eventos disponibles</p>';
    return;
  }

  container.innerHTML = eventos.map(ev => {
    const pct = _pct(ev.inscritos, ev.aforo);
    const fillCls = pct >= 85 ? 'an-fill-danger' : pct >= 60 ? 'an-fill-warn' : 'an-fill-ok';
    const badgeCls = pct >= 85 ? 'badge badge-danger' : pct >= 60 ? 'badge badge-warning' : 'badge badge-success';
    return `
      <div class="an-event-row">
        <div class="an-event-name">${ev.titulo}</div>
        <div class="an-event-meta">
          <span class="an-event-date">${_fmtDate(ev.fecha)}</span>
          <span class="an-inscritos"><strong>${ev.inscritos}</strong> / ${ev.aforo}</span>
          <div class="an-bar-wrap">
            <div class="an-bar-fill ${fillCls}" style="width:${Math.min(pct,100)}%"></div>
          </div>
          <span class="${badgeCls}" style="font-size:0.7rem;padding:2px 8px;">${pct}%</span>
        </div>
      </div>`;
  }).join('');
}

// ─── 7. Tabla: Campañas de donación ───────────────────────────────

function _renderAnDonativos() {
  const container = document.getElementById('an-donativos-list');
  if (!container) return;

  const dons = (typeof MOCK_DONATIVOS !== 'undefined') ? MOCK_DONATIVOS : [];
  if (!dons.length) {
    container.innerHTML = '<p class="an-empty">Sin campañas activas</p>';
    return;
  }

  container.innerHTML = dons.map(d => {
    const pct = _pct(d.actual, d.meta);
    const fillCls = pct >= 80 ? 'an-fill-success' : pct >= 50 ? 'an-fill-warn' : 'an-fill-ok';
    return `
      <div class="an-donation-row">
        <div class="an-donation-name">${d.titulo}</div>
        <div class="an-donation-amounts">
          <span class="an-amount-raised">${_fmtEur(d.actual)}</span>
          <span class="an-amount-goal">de ${_fmtEur(d.meta)}</span>
          <span class="an-donation-donantes">${d.donantes} donantes</span>
          <span class="an-donation-days">${d.diasRestantes}d restantes</span>
        </div>
        <div class="an-bar-row">
          <div class="an-bar-wrap" style="flex:1;">
            <div class="an-bar-fill ${fillCls}" style="width:${Math.min(pct,100)}%"></div>
          </div>
          <span class="an-pct-label">${pct}%</span>
        </div>
      </div>`;
  }).join('');
}

// ─── 8. Tabla: Noticias más leídas ────────────────────────────────

function _renderAnNoticias() {
  const container = document.getElementById('an-noticias-list');
  if (!container) return;

  const reads = _getMergedNewsReads();
  const noticias = (typeof MOCK_NOTICIAS_V2 !== 'undefined') ? MOCK_NOTICIAS_V2 : [];

  const sorted = noticias
    .map(n => Object.assign({}, n, { totalReads: reads[n.id] || 0 }))
    .sort((a, b) => b.totalReads - a.totalReads);

  container.innerHTML = sorted.map((n, i) => `
    <div class="an-news-row">
      <span class="an-news-rank ${i < 3 ? 'an-rank-top' : ''}">#${i + 1}</span>
      <div class="an-news-info">
        <div class="an-news-title" title="${n.titulo}">${n.titulo}</div>
        <div class="an-news-meta">${n.categoria}${n.isPinned ? ' &nbsp;·&nbsp; 📌 destacada' : ''}</div>
      </div>
      <div class="an-news-views">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:13px;height:13px;vertical-align:-2px;margin-right:3px;opacity:.6;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
        ${n.totalReads.toLocaleString('es-ES')}
      </div>
    </div>`).join('');
}

// ─── 9. Chart: Inscripciones por evento ───────────────────────────

function _renderChartEventos() {
  _destroyChart('eventos');
  const canvas = document.getElementById('chart-eventos');
  if (!canvas || typeof Chart === 'undefined') return;

  const ev = (typeof MOCK_EVENTOS !== 'undefined') ? MOCK_EVENTOS : [];
  const labels    = ev.map(e => e.titulo.length > 20 ? e.titulo.slice(0, 20) + '…' : e.titulo);
  const inscritos = ev.map(e => e.inscritos || 0);
  const aforos    = ev.map(e => e.aforo || 0);

  _anCharts['eventos'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Inscritos',
          data: inscritos,
          backgroundColor: 'rgba(27,46,94,0.85)',
          borderRadius: 5,
          borderSkipped: false
        },
        {
          label: 'Aforo',
          data: aforos,
          backgroundColor: 'rgba(201,168,76,0.2)',
          borderColor: 'rgba(201,168,76,0.7)',
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12, usePointStyle: true } },
        tooltip: {
          callbacks: {
            afterLabel(ctx) {
              if (ctx.datasetIndex === 0) {
                return 'Ocupación: ' + _pct(inscritos[ctx.dataIndex], aforos[ctx.dataIndex]) + '%';
              }
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

// ─── 10. Chart: Visitas por sección ───────────────────────────────

function _renderChartSecciones() {
  _destroyChart('secciones');
  const canvas = document.getElementById('chart-secciones');
  if (!canvas || typeof Chart === 'undefined') return;

  const views = _getMergedPageViews();
  const sorted = Object.values(views).sort((a, b) => b.views - a.views);

  const colors = sorted.map((_, i) => {
    const alpha = Math.max(0.25, 0.9 - i * 0.07);
    return `rgba(27,46,94,${alpha})`;
  });

  _anCharts['secciones'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sorted.map(s => s.label),
      datasets: [{
        label: 'Visitas',
        data: sorted.map(s => s.views),
        backgroundColor: colors,
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

// ─── 11. Chart: Donut — distribución de miembros ──────────────────

function _renderChartUsuarios() {
  _destroyChart('usuarios');
  const canvas = document.getElementById('chart-usuarios');
  if (!canvas || typeof Chart === 'undefined') return;

  const users = (typeof MOCK_USERS !== 'undefined') ? MOCK_USERS : [];
  const activos    = users.filter(u => u.status === 'active').length || 5;
  const pendientes = users.filter(u => u.status === 'pending').length || 2;
  const baneados   = users.filter(u => u.status === 'banned').length || 1;

  _anCharts['usuarios'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Activos', 'Pendientes', 'Baneados'],
      datasets: [{
        data: [activos, pendientes, baneados],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14, usePointStyle: true } },
        tooltip: {
          callbacks: {
            label(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return ' ' + ctx.label + ': ' + ctx.parsed + ' (' + Math.round((ctx.parsed / total) * 100) + '%)';
            }
          }
        }
      }
    }
  });
}

// ─── 12. Chart: Línea — nuevos miembros por mes ───────────────────

function _renderChartNuevos() {
  _destroyChart('nuevos');
  const canvas = document.getElementById('chart-nuevos');
  if (!canvas || typeof Chart === 'undefined') return;

  _anCharts['nuevos'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: _AN_MONTHLY_MEMBERS.map(m => m.month),
      datasets: [{
        label: 'Nuevos miembros',
        data: _AN_MONTHLY_MEMBERS.map(m => m.count),
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
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { stepSize: 1, font: { size: 11 } }
        }
      }
    }
  });
}

// ─── 13. Función principal ────────────────────────────────────────

function loadAnalyticsDashboard() {
  _renderAnKPIs();
  _renderAnEventos();
  _renderAnDonativos();
  _renderAnNoticias();
  // Render charts after a brief timeout to ensure canvases are visible
  setTimeout(function() {
    _renderChartEventos();
    _renderChartSecciones();
    _renderChartUsuarios();
    _renderChartNuevos();
  }, 60);
}
