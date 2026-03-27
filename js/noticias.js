/* =============================================
   KEHILÁ — noticias.js
   ============================================= */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    requireAuth();
    initNav('noticias');
    renderPageHeader();
    // Cargar noticias desde Supabase
    await loadNoticiasSupabase();
    renderDestacadas();
    renderFiltros();
    renderGrid('todas');
    initDelegation();
  } catch (e) {
    console.error('Error iniciando noticias:', e);
  }
});

async function loadNoticiasSupabase() {
  try {
    const sb = typeof getSupabase === 'function' ? getSupabase() : null;
    if (!sb) return;
    const { data } = await sb.from('noticias').select('*').order('created_at', { ascending: false });
    if (data?.length && typeof MOCK_NOTICIAS_V2 !== 'undefined') {
      data.forEach(n => MOCK_NOTICIAS_V2.unshift(n));
    }
  } catch(e) { console.warn('noticias supabase:', e); }
}

/* ── Helpers ── */

function formatearFecha(fechaStr) {
  try {
    const fecha = new Date(fechaStr + 'T12:00:00');
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return fechaStr ?? ''; }
}

function formatearFechaCorta(fechaStr) {
  try {
    const fecha = new Date(fechaStr + 'T12:00:00');
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  } catch (e) { return fechaStr ?? ''; }
}

function getNoticias() {
  return (typeof MOCK_NOTICIAS_V2 !== 'undefined') ? MOCK_NOTICIAS_V2 : [];
}

function getCfg() {
  return (typeof CATEGORIA_CONFIG !== 'undefined') ? CATEGORIA_CONFIG : {};
}

function catLabel(cat) {
  return getCfg()[cat]?.label ?? cat ?? '';
}

function catColor(n) {
  return n?.colorCategoria ?? getCfg()[n?.categoria]?.color ?? '#1B2E5E';
}

/* ── Page Header ── */

function renderPageHeader() {
  try {
    const user = getCurrentUser?.() ?? null;
    const adminBtn = user?.role === 'admin'
      ? `<button class="btn btn-primary btn-sm" data-action="nueva-noticia">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:15px;height:15px"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
           Nueva noticia
         </button>`
      : '';
    document.getElementById('page-header').innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-header-label">Comunidad</div>
          <h1 class="page-header-title">Noticias</h1>
          <p class="page-header-sub">Actualidad de tu comunidad y del mundo judío</p>
        </div>
        <div class="page-header-actions">${adminBtn}</div>
      </div>`;
  } catch (e) { console.error('renderPageHeader:', e); }
}

/* ── Destacadas (no-op, las destacadas se mezclan en el grid con badge) ── */

function renderDestacadas() {}

/* ── Filtros ── */

function renderFiltros() {
  try {
    const container = document.getElementById('filtros-container');
    if (!container) return;
    const cats = [
      { key: 'todas',     label: 'Todas' },
      { key: 'comunidad', label: 'Comunidad' },
      { key: 'israel',    label: 'Israel' },
      { key: 'halacha',   label: 'Halaká' },
      { key: 'evento',    label: 'Eventos' },
      { key: 'kashrut',   label: 'Kashrut' }
    ];
    const total = getNoticias().length;
    const chips = cats.map((c, i) =>
      `<button class="chip${i === 0 ? ' active' : ''}" data-categoria="${c.key}">${c.label}</button>`
    ).join('');
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h2 style="font-size:1rem;font-weight:600;color:var(--color-text)">Últimas noticias</h2>
        <span id="noticias-count" style="font-size:0.8rem;color:var(--color-text-muted)">${total} artículos</span>
      </div>
      <div class="filter-chips">${chips}</div>`;
  } catch (e) { console.error('renderFiltros:', e); }
}

/* ── Grid ── */

function renderGrid(filtro) {
  try {
    const container = document.getElementById('noticias-grid');
    if (!container) return;

    let lista = getNoticias();
    if (filtro && filtro !== 'todas') lista = lista.filter(n => n?.categoria === filtro);

    const countEl = document.getElementById('noticias-count');
    if (countEl) countEl.textContent = `${lista.length} artículo${lista.length !== 1 ? 's' : ''}`;

    if (!lista.length) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:36px;height:36px;opacity:.4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
          <p>No hay noticias en esta categoría</p>
        </div>`;
      return;
    }

    container.innerHTML = lista.map(n => {
      const fecha = n.fecha ? new Date(n.fecha + 'T12:00:00') : new Date();
      const day   = fecha.getDate();
      const month = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
      const cat   = catLabel(n.categoria);
      const pinnedBadge = n.isPinned
        ? `<span class="chip" style="font-size:.7rem;padding:3px 8px;background:#FEF9C3;color:#92400E;border-color:#FDE68A">★ Dest.</span>`
        : '';
      const imgHTML = n.imagen_url
        ? `<img src="${n.imagen_url}" style="width:100%;height:120px;object-fit:cover;" alt="">`
        : '';
      return `
        <div class="noticia-card-new nc-cat-${n.categoria ?? 'comunidad'}" data-id="${n.id ?? ''}" data-action="abrir-noticia">
          ${imgHTML}
          <div class="ev-card-header">
            <div class="ev-date-block">
              <span class="ev-day">${day}</span>
              <span class="ev-month">${month}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:flex-start">
              <span class="chip" style="font-size:.7rem;padding:3px 10px;cursor:default">${cat}</span>
              ${pinnedBadge}
            </div>
          </div>
          <div class="ev-card-body">
            <div class="ev-title">${n.titulo ?? ''}</div>
            <div class="ev-desc">${n.excerpt ?? ''}</div>
            <div class="ev-meta-row">
              <span class="ev-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
                ${n.autor ?? ''}
              </span>
              <span class="ev-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                ${n.tiempoLectura ?? ''} lectura
              </span>
            </div>
          </div>
          <div class="ev-card-footer">
            <span></span>
            <button class="btn btn-sm btn-primary" data-id="${n.id ?? ''}" data-action="abrir-noticia">Leer noticia</button>
          </div>
        </div>`;
    }).join('');
  } catch (e) { console.error('renderGrid:', e); }
}

/* ── Delegación ── */

function initDelegation() {
  document.addEventListener('click', (e) => {
    try {
      const card = e.target.closest('[data-action="abrir-noticia"]');
      if (card) { abrirNoticia(card.dataset.id); return; }

      const filtro = e.target.closest('.filter-chips [data-categoria]');
      if (filtro) {
        document.querySelectorAll('.filter-chips [data-categoria]').forEach(b => b.classList.remove('active'));
        filtro.classList.add('active');
        renderGrid(filtro.dataset.categoria);
        return;
      }

      if (e.target.closest('[data-action="nueva-noticia"]')) { abrirModalNueva(); return; }
      if (e.target.closest('[data-action="cerrar-modal"]')) { cerrarModal(); return; }
      if (e.target.classList.contains('drawer-overlay')) { cerrarModal(); return; }
      if (e.target.classList.contains('modal-overlay')) { cerrarModal(); return; }
    } catch (err) { console.error('delegación:', err); }
  });
}

/* ── Drawer ── */

function abrirNoticia(id) {
  try {
    const n = getNoticias().find(x => x?.id === id);
    if (!n) return;
    cerrarModal();

    const user = getCurrentUser?.() ?? null;
    const color = catColor(n);
    const parrafos = (n.contenido ?? n.excerpt ?? '')
      .split(/\n\n+/).filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`).join('');
    const adminBtn = user?.role === 'admin'
      ? `<button class="btn btn-secondary btn-sm">Editar</button>` : '';

    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';

    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.id = 'noticia-drawer';
    drawer.style.cssText = 'width:520px;max-width:100vw';
    drawer.innerHTML = `
      <div style="height:3px;background:${color};flex-shrink:0"></div>
      <div class="drawer-header" style="padding:var(--space-6) var(--space-8) var(--space-5)">
        <div class="drawer-header-top">
          <span class="badge" style="font-size:10px;padding:2px 8px;letter-spacing:0.06em">${catLabel(n.categoria)}</span>
          <button class="drawer-close-btn" data-action="cerrar-modal" title="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="drawer-body" style="padding:var(--space-6) var(--space-8) var(--space-8)">
        <h2 style="font-family:'Frank Ruhl Libre',serif;font-size:1.55rem;font-weight:300;line-height:1.3;margin-bottom:var(--space-5);color:var(--color-text)">${n.titulo ?? ''}</h2>
        <div class="drawer-body-meta" style="gap:var(--space-3);font-size:12px;color:var(--color-text-muted);margin-bottom:var(--space-6);padding-bottom:var(--space-6);border-bottom:1px solid var(--color-border);display:flex;flex-wrap:wrap">
          <span>${n.autor ?? ''}</span>
          <span>·</span>
          <span>${formatearFecha(n.fecha)}</span>
          <span>·</span>
          <span>${n.tiempoLectura ?? ''} lectura</span>
        </div>
        <div class="drawer-body-contenido">${parrafos}</div>
      </div>
      <div class="drawer-footer" style="padding:var(--space-4) var(--space-8) var(--space-6)">
        <button class="btn btn-secondary btn-sm" onclick="showToast('Enlace copiado','success')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.185 2.25 2.25 0 0 0-3.935 2.185Z"/></svg>
          Compartir
        </button>
        ${adminBtn}
        <button class="btn btn-primary btn-sm" data-action="cerrar-modal">Cerrar</button>
      </div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  } catch (e) { console.error('abrirNoticia:', e); }
}

function cerrarModal() {
  try {
    const drawer = document.getElementById('noticia-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const modal = document.getElementById('modal-nueva-noticia');
    if (drawer) { drawer.classList.add('drawer-closing'); setTimeout(() => drawer.remove(), 220); }
    if (overlay) { overlay.style.transition = 'opacity .2s'; overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 220); }
    if (modal) modal.remove();
  } catch (e) { console.error('cerrarModal:', e); }
}

/* ── Modal nueva noticia (admin) ── */

function abrirModalNueva() {
  try {
    cerrarModal();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'modal-nueva-noticia';
    modal.innerHTML = `
      <div class="modal" style="max-width:540px">
        <div class="modal-header">
          <h3 class="modal-title">Nueva noticia</h3>
          <button class="modal-close" data-action="cerrar-modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width:17px;height:17px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:var(--space-4)">
          <div class="form-group">
            <label class="form-label">Título *</label>
            <input type="text" class="form-input" id="nueva-titulo" placeholder="Título de la noticia">
          </div>
          <div class="form-group">
            <label class="form-label">Categoría</label>
            <select class="form-input" id="nueva-categoria">
              <option value="comunidad">Comunidad</option>
              <option value="israel">Israel</option>
              <option value="halacha">Halaká</option>
              <option value="evento">Evento</option>
              <option value="kashrut">Kashrut</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Resumen * <span style="font-weight:400;color:var(--color-text-muted)">(máx. 200 caracteres)</span></label>
            <textarea class="form-input" id="nueva-excerpt" rows="3" maxlength="200" placeholder="Breve descripción visible en el listado"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Contenido completo</label>
            <textarea class="form-input" id="nueva-contenido" rows="5" placeholder="Texto completo de la noticia..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Foto de la noticia</label>
            <div style="border:2px dashed #ddd;border-radius:10px;padding:20px;text-align:center;cursor:pointer;" onclick="document.getElementById('nueva-img-file').click()">
              <img id="nueva-img-preview" style="display:none;max-height:130px;border-radius:8px;margin-bottom:8px;max-width:100%;">
              <div id="nueva-img-ph" style="color:#888;font-size:0.85rem;">📷 Toca para subir foto</div>
            </div>
            <input type="file" id="nueva-img-file" accept="image/*" style="display:none;">
          </div>
          <label style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer;font-size:var(--text-sm)">
            <input type="checkbox" id="nueva-pinned"> Fijar como noticia destacada
          </label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-action="cerrar-modal">Cancelar</button>
          <button class="btn btn-primary" id="btn-publicar">Publicar noticia</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Preview de imagen
    document.getElementById('nueva-img-file').addEventListener('change', function() {
      const file = this.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('nueva-img-preview').src = e.target.result;
        document.getElementById('nueva-img-preview').style.display = 'block';
        document.getElementById('nueva-img-ph').style.display = 'none';
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-publicar').addEventListener('click', async () => {
      try {
        const titulo = document.getElementById('nueva-titulo')?.value?.trim();
        const excerpt = document.getElementById('nueva-excerpt')?.value?.trim();
        if (!titulo || !excerpt) { showToast('El título y el resumen son obligatorios', 'error'); return; }

        const btn = document.getElementById('btn-publicar');
        btn.textContent = 'Publicando...'; btn.disabled = true;

        // Subir imagen
        const imgFile = document.getElementById('nueva-img-file')?.files[0];
        let imagen_url = null;
        if (imgFile && typeof uploadMedia === 'function') {
          imagen_url = await uploadMedia(imgFile, 'noticias');
        }

        const categoria = document.getElementById('nueva-categoria')?.value ?? 'comunidad';
        const nuevaNoticia = {
          isPinned: document.getElementById('nueva-pinned')?.checked ?? false,
          is_pinned: document.getElementById('nueva-pinned')?.checked ?? false,
          categoria,
          titulo, excerpt,
          contenido: document.getElementById('nueva-contenido')?.value?.trim() ?? excerpt,
          autor: getCurrentUser?.()?.name ?? 'Administrador',
          fecha: new Date().toISOString().split('T')[0],
          tiempoLectura: '2 min',
          colorCategoria: getCfg()[categoria]?.color ?? '#1B2E5E',
          imagen_url
        };

        // Guardar en Supabase
        const sb = typeof getSupabase === 'function' ? getSupabase() : null;
        if (sb) {
          const { data, error } = await sb.from('noticias').insert(nuevaNoticia).select().single();
          if (!error && data) nuevaNoticia.id = data.id;
          else if (error) { showToast('Error: ' + error.message, 'error'); btn.textContent = 'Publicar noticia'; btn.disabled = false; return; }
        } else {
          nuevaNoticia.id = 'n' + Date.now();
        }

        MOCK_NOTICIAS_V2.unshift(nuevaNoticia);
        cerrarModal();
        renderDestacadas();
        renderFiltros();
        renderGrid('todas');
        showToast('Noticia publicada para toda la comunidad ✓', 'success');
      } catch (err) { console.error('publicar:', err); showToast('Error al publicar', 'error'); }
    });
  } catch (e) { console.error('abrirModalNueva:', e); }
}
