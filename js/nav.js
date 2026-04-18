/**
 * @file nav.js
 * @description Navegación global: sidebar desktop, bottom nav móvil, hamburger y toasts.
 *
 * Este archivo se incluye en TODAS las páginas protegidas y genera la navegación
 * de forma dinámica en el cliente (no hay servidor que genere el HTML).
 *
 * Componentes que genera:
 *  - Sidebar izquierdo (desktop ≥ 769px): con avatar, nombre, links y logout
 *  - Bottom navigation (móvil ≤ 768px): 4-5 iconos principales
 *  - Menú "Más" drawer (móvil): el resto de secciones
 *  - Hamburger menu: navegación completa en móvil
 *  - Page header: título de sección + acciones contextuales
 *  - Toast notifications: mensajes temporales de estado
 *  - Legal footer: enlace a páginas legales
 *
 * DEPENDENCIAS:
 *  - auth.js → getCurrentUser(), getAvatarColor(), renderAvatar(), logout()
 *    Debe cargarse ANTES que nav.js.
 *
 * PUNTO DE ENTRADA: initNav(activePage) — llamar en DOMContentLoaded de cada página.
 *
 * AÑADIR UNA NUEVA SECCIÓN AL MENÚ:
 *  1. Añadir entrada al array NAV_ITEMS (grupo + item con id, label, href, icon)
 *  2. Si debe aparecer en bottom nav móvil, añadir a BOTTOM_NAV_ITEMS
 *  3. Crear el archivo HTML correspondiente
 *  4. Llamar initNav('id-de-la-nueva-seccion') en esa página
 */

/**
 * Escapa caracteres HTML peligrosos para prevenir XSS.
 * Disponible globalmente — se usa en nav.js, noticias.js, wallap.html y otros.
 * @param {*} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const NAV_ITEMS = [
  {
    group: '',
    items: [
      {
        id: 'home',
        label: 'Inicio',
        href: 'home.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`
      }
    ]
  },
  {
    group: 'Principal',
    items: [
      {
        id: 'calendario',
        label: 'Calendario Hebreo',
        href: 'calendario.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`
      },
      {
        id: 'eventos',
        label: 'Eventos',
        href: 'eventos.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>`
      },
      {
        id: 'rav-hub',
        label: 'Beit HaRav',
        href: 'rav-hub.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>`
      },
      {
        id: 'comunidad',
        label: 'Comunidad',
        href: 'comunidad.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/></svg>`
      },
      {
        id: 'donativos',
        label: 'Donativos',
        href: 'donativos.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`
      },
      {
        id: 'esencial',
        label: 'Fundamentos',
        href: 'esencial-hub.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>`
      }
    ]
  },
  {
    group: 'Mi cuenta',
    items: [
      {
        id: 'perfil',
        label: 'Mi perfil',
        href: 'perfil.html',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`
      }
    ]
  }
];

// Items de bottom nav (máximo 5)
const BOTTOM_NAV_ITEMS = [
  { id: 'home',       href: 'home.html',       icon: NAV_ITEMS[0].items[0].icon },
  { id: 'calendario', href: 'calendario.html', icon: NAV_ITEMS[1].items[0].icon },
  { id: 'eventos',    href: 'eventos.html',    icon: NAV_ITEMS[1].items[1].icon },
  { id: 'comunidad',  href: 'comunidad.html',  icon: NAV_ITEMS[1].items[3].icon },
];

/**
 * Construye e inyecta el sidebar en .sidebar-placeholder o crea uno.
 * @param {string} activePage - id de la página activa
 */
/**
 * Construye e inyecta el sidebar de navegación lateral (solo desktop).
 * Si la página está en un iframe, oculta el sidebar y ajusta márgenes.
 *
 * @param {string} activePage - ID de la página activa (ej: 'home', 'eventos')
 *   Debe coincidir con el campo `id` en NAV_ITEMS.
 */
function buildSidebar(activePage) {
  // Si está en un iframe, suprimir sidebar y quitar márgenes
  if (window.self !== window.top) {
    var embedStyle = document.createElement('style');
    embedStyle.textContent = '.sidebar{display:none!important;}.main-content{margin-left:0!important;width:100vw!important;padding-bottom:0!important;}.page-header{display:none!important;}.bottom-nav{display:none!important;}';
    document.head.appendChild(embedStyle);
    return;
  }

  const user = getCurrentUser();
  if (!user) return;

  const color = getAvatarColor(user.name);
  const initials = user.initials || user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Función de traducción local (i18n puede no estar cargado aún)
  const _t = (key) => (typeof t === 'function') ? t(key) : key;
  const _lang = (typeof getLang === 'function') ? getLang() : 'es';

  // Mapa de ids a claves i18n
  const NAV_KEYS = {
    home: 'nav_home', eventos: 'nav_eventos', calendario: 'nav_calendario',
    'rav-hub': 'nav_rav_hub', comunidad: 'nav_comunidad', donativos: 'nav_donativos',
    esencial: 'nav_esencial', perfil: 'nav_perfil'
  };
  const GROUP_KEYS = {
    'Principal': 'group_principal', 'Mi cuenta': 'group_cuenta'
  };

  // Construir grupos de navegación
  let navHTML = '';
  NAV_ITEMS.forEach(group => {
    const groupLabel = _t(GROUP_KEYS[group.group] || group.group);
    navHTML += `<div class="nav-group-label">${groupLabel}</div>`;
    group.items.forEach(item => {
      const active = item.id === activePage ? 'active' : '';
      const label = _t(NAV_KEYS[item.id] || ('nav_' + item.id)) || item.label;
      navHTML += `
        <a href="${item.href}" class="nav-item ${active}" data-page="${item.id}">
          ${item.icon}
          <span>${label}</span>
        </a>`;
    });
  });

  // Item admin (solo si es admin)
  let adminHTML = '';
  if (user.role === 'admin') {
    const adminActive = activePage === 'admin' ? 'active' : '';
    adminHTML = `
      <div class="nav-divider"></div>
      <a href="admin.html" class="nav-item admin-item ${adminActive}" data-page="admin">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"/></svg>
        <span>${_t('nav_admin')}</span>
      </a>`;
  }

  const roleLabelMap = {
    es: { admin: 'Administrador', miembro: 'Miembro', mod: 'Moderador' },
    en: { admin: 'Administrator', miembro: 'Member', mod: 'Moderator' }
  };
  const roleLabel = (roleLabelMap[_lang] || roleLabelMap.es)[user.role] || user.role;
  const verPerfil = _lang === 'en' ? 'View profile' : 'Ver perfil';
  const cerrarSesion = _t('nav_logout');

  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-inner">
        <!-- Logo -->
        <a href="home.html" class="sidebar-logo" style="text-decoration:none;cursor:pointer;display:flex;justify-content:center;align-items:center;width:100%;padding:6px 0 14px;">
          <img src="img/logo_jabad.png" alt="Jabad Barcelona" style="width:112px;height:112px;object-fit:contain;display:block;flex-shrink:0;">
        </a>

        <!-- Usuario -->
        <a href="perfil.html" class="sidebar-user" style="text-decoration:none;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background=''">
          <div class="avatar avatar-md" data-color="${color}">${escHtml(initials)}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${escHtml(user.name)}</div>
            <div class="sidebar-user-role">${roleLabel} · ${verPerfil}</div>
          </div>
        </a>

        <!-- Navegación -->
        <nav class="sidebar-nav">
          ${navHTML}
          ${adminHTML}
        </nav>

        <!-- Footer: lang toggle + logout -->
        <div class="sidebar-footer">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 18px 2px;">
            <button class="lang-toggle-btn" onclick="toggleLang()" style="font-size:0.7rem;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.45);background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:3px;padding:3px 8px;cursor:pointer;font-family:inherit;transition:all 0.15s;" title="${_lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}">${_lang === 'es' ? 'EN' : 'ES'}</button>
          </div>
          <button class="sidebar-logout" onclick="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/></svg>
            <span>${cerrarSesion}</span>
          </button>
        </div>
      </div>
    </aside>`;

  // Inyectar en el DOM
  const placeholder = document.getElementById('sidebar-placeholder');
  if (placeholder) {
    placeholder.outerHTML = sidebarHTML;
  } else {
    // Insertar antes del main content si existe
    const layout = document.querySelector('.app-layout');
    if (layout) {
      layout.insertAdjacentHTML('afterbegin', sidebarHTML);
    }
  }
}

/**
 * Construye e inyecta la barra de navegación móvil inferior.
 * @param {string} activePage - id de la página activa
 */
/**
 * Construye e inyecta la barra de navegación inferior para móvil.
 * Muestra los items definidos en BOTTOM_NAV_ITEMS + botón "Más".
 *
 * @param {string} activePage - ID de la página activa
 */
function buildBottomNav(activePage) {
  if (window.self !== window.top) return;
  const _t = (key) => (typeof t === 'function') ? t(key) : key;
  const NAV_KEYS = {
    home: 'nav_home', eventos: 'nav_eventos', calendario: 'nav_calendario',
    'rav-hub': 'nav_rav_hub', comunidad: 'nav_comunidad', donativos: 'nav_donativos',
    esencial: 'nav_esencial', perfil: 'nav_perfil'
  };

  const moreLabel = _t('nav_more') || 'Más';

  let itemsHTML = '';
  BOTTOM_NAV_ITEMS.forEach(item => {
    const active = item.id === activePage ? 'active' : '';
    const label = _t(NAV_KEYS[item.id]) || item.id;
    itemsHTML += `
      <a href="${item.href}" class="bottom-nav-item ${active}">
        ${item.icon}
        <span>${label}</span>
      </a>`;
  });

  // Botón "Más"
  const moreActive = !BOTTOM_NAV_ITEMS.find(i => i.id === activePage) ? 'active' : '';
  itemsHTML += `
    <button class="bottom-nav-item ${moreActive}" id="bottom-more-btn" onclick="toggleMoreDrawer()">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:22px;height:22px;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
      </svg>
      <span>${moreLabel}</span>
    </button>`;

  const bottomNavHTML = `
    <nav class="bottom-nav" id="bottom-nav">
      <div class="bottom-nav-items">${itemsHTML}</div>
    </nav>`;

  const existing = document.getElementById('bottom-nav');
  if (existing) {
    existing.outerHTML = bottomNavHTML;
  } else {
    document.body.insertAdjacentHTML('beforeend', bottomNavHTML);
  }

  buildMoreDrawer(activePage);
}

/**
 * Construye el drawer "Más" con todas las páginas.
 */
function buildMoreDrawer(activePage) {
  const _t  = (key) => (typeof t === 'function') ? t(key) : key;
  const _lang = (typeof getLang === 'function') ? getLang() : 'es';
  const user = getCurrentUser();

  const NAV_KEYS = {
    home: 'nav_home', eventos: 'nav_eventos', calendario: 'nav_calendario',
    'rav-hub': 'nav_rav_hub', comunidad: 'nav_comunidad', donativos: 'nav_donativos',
    esencial: 'nav_esencial', perfil: 'nav_perfil'
  };
  const GROUP_KEYS = {
    'Principal': 'group_principal', 'Mi cuenta': 'group_cuenta'
  };

  let sectionsHTML = '';
  NAV_ITEMS.forEach(group => {
    const groupLabel = _t(GROUP_KEYS[group.group] || group.group);
    let rowsHTML = '';
    group.items.forEach(item => {
      const label = _t(NAV_KEYS[item.id] || ('nav_' + item.id)) || item.label;
      const active = item.id === activePage ? 'style="color:var(--color-primary);font-weight:600;"' : '';
      rowsHTML += `
        <a href="${item.href}" class="more-drawer-item" ${active}>
          <span class="more-drawer-icon">${item.icon}</span>
          <span>${label}</span>
        </a>`;
    });
    sectionsHTML += `
      <div class="more-drawer-section">
        <div class="more-drawer-group-label">${groupLabel}</div>
        <div class="more-drawer-grid">${rowsHTML}</div>
      </div>`;
  });

  // Admin link
  if (user?.role === 'admin') {
    sectionsHTML += `
      <div class="more-drawer-section">
        <div class="more-drawer-grid">
          <a href="admin.html" class="more-drawer-item" ${activePage === 'admin' ? 'style="color:var(--color-primary);font-weight:600;"' : ''}>
            <span class="more-drawer-icon"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:22px;height:22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"/></svg></span>
            <span>${_t('nav_admin')}</span>
          </a>
        </div>
      </div>`;
  }

  const langLabel = _lang === 'es' ? 'EN' : 'ES';
  const langTitle = _lang === 'es' ? 'Switch to English' : 'Cambiar a Español';
  const closeLabel = _lang === 'es' ? 'Cerrar' : 'Close';

  const drawerHTML = `
    <div id="more-drawer-backdrop" onclick="toggleMoreDrawer()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:699;"></div>
    <div id="more-drawer" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:700;background:#fff;border-radius:20px 20px 0 0;padding:0 0 env(safe-area-inset-bottom,0);max-height:80vh;overflow-y:auto;transform:translateY(100%);transition:transform 0.3s cubic-bezier(.32,.72,0,1);">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 8px;border-bottom:1px solid #e2e8f0;">
        <span style="font-weight:700;font-size:1rem;color:#1a202c;">Jabad Barcelona</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <button onclick="toggleLang();toggleMoreDrawer();" style="font-size:0.7rem;font-weight:700;color:#718096;background:#f7fafc;border:1px solid #e2e8f0;border-radius:4px;padding:4px 10px;cursor:pointer;">${langLabel}</button>
          <button onclick="toggleMoreDrawer()" style="background:none;border:none;font-size:0.85rem;color:#718096;cursor:pointer;padding:4px 8px;">${closeLabel}</button>
        </div>
      </div>
      <div style="padding:12px 16px 20px;">
        ${sectionsHTML}
      </div>
      <div style="padding:0 16px 16px;">
        <button onclick="logout()" style="width:100%;padding:12px;border:1.5px solid #e2e8f0;border-radius:10px;background:none;color:#718096;font-size:0.875rem;cursor:pointer;font-family:inherit;">
          ${_t('nav_logout')}
        </button>
      </div>
    </div>`;

  // CSS del drawer
  if (!document.getElementById('more-drawer-styles')) {
    const style = document.createElement('style');
    style.id = 'more-drawer-styles';
    style.textContent = `
      .more-drawer-section { margin-bottom: 16px; }
      .more-drawer-group-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a0aec0; padding: 0 4px; margin-bottom: 6px; }
      .more-drawer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
      .more-drawer-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 4px; border-radius: 10px; text-decoration: none; color: #4a5568; font-size: 0.72rem; font-weight: 500; transition: background 0.15s; }
      .more-drawer-item:active { background: #f7fafc; }
      .more-drawer-icon { color: #1B2E5E; }
      .more-drawer-icon svg { width: 22px; height: 22px; }
      #more-drawer.open { transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);
  }

  // Eliminar drawer anterior si existe
  document.getElementById('more-drawer')?.remove();
  document.getElementById('more-drawer-backdrop')?.remove();
  document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

/**
 * Abre o cierra el drawer "Más" en móvil que muestra secciones secundarias.
 */
function toggleMoreDrawer() {
  const drawer   = document.getElementById('more-drawer');
  const backdrop = document.getElementById('more-drawer-backdrop');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    backdrop.style.display = 'none';
    setTimeout(() => { drawer.style.display = 'none'; }, 300);
  } else {
    drawer.style.display = 'block';
    backdrop.style.display = 'block';
    requestAnimationFrame(() => drawer.classList.add('open'));
  }
}

/**
 * Construye e inyecta el botón hamburguesa + drawer lateral (solo móvil).
 * @param {string} activePage
 */
function buildHamburger(activePage) {
  if (window.self !== window.top) return;
  const user = getCurrentUser();
  if (!user) return;

  const color = getAvatarColor(user.name);
  const initials = user.initials || user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const roleLabel = { admin: 'Administrador', miembro: 'Miembro', mod: 'Moderador' }[user.role] || user.role;

  // Construir nav items para el drawer
  let navHTML = '';
  NAV_ITEMS.forEach(group => {
    navHTML += `<div class="hb-group-label">${group.group}</div>`;
    group.items.forEach(item => {
      const active = item.id === activePage ? 'active' : '';
      navHTML += `<a href="${item.href}" class="hb-nav-item ${active}">${item.icon}<span>${item.label}</span></a>`;
    });
  });
  if (user.role === 'admin') {
    navHTML += `
      <div class="hb-divider"></div>
      <a href="admin.html" class="hb-nav-item${activePage === 'admin' ? ' active' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"/></svg>
        <span>Panel Admin</span>
      </a>`;
  }

  const drawerHTML = `
    <div id="hb-overlay" onclick="closeHamburger()" style="display:none"></div>
    <div id="hb-drawer">
      <div class="hb-header">
        <a href="home.html" class="hb-logo" style="text-decoration:none;" onclick="closeHamburger()">
          <img src="img/logo_jabad.png" alt="Jabad Barcelona" style="width:36px;height:36px;object-fit:contain;flex-shrink:0;">
          <div>
            <div class="hb-logo-text">Jabad Barcelona</div>
            <div class="hb-logo-sub">Comunidad Jabad Lubavitch</div>
          </div>
        </a>
        <button class="hb-close" onclick="closeHamburger()" aria-label="Cerrar menú">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="hb-user">
        <div class="avatar avatar-md" data-color="${color}">${escHtml(initials)}</div>
        <div class="hb-user-info">
          <div class="hb-user-name">${escHtml(user.name)}</div>
          <div class="hb-user-role">${roleLabel}</div>
        </div>
      </div>
      <nav class="hb-nav">${navHTML}</nav>
      <div class="hb-footer">
        <button class="hb-logout" onclick="logout()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/></svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    /* Hamburger button */
    #hb-btn {
      display: none;
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 500;
      width: 40px; height: 40px;
      border-radius: 10px;
      background: var(--color-primary, #1b2e5e);
      border: none;
      color: #fff;
      cursor: pointer;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 0;
      box-shadow: 0 2px 8px rgba(27,46,94,.25);
    }
    #hb-btn span {
      display: block;
      width: 18px; height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: transform .2s, opacity .2s;
    }
    @media (max-width: 768px) {
      #hb-btn { display: flex; }
    }

    /* Overlay */
    #hb-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 600;
      backdrop-filter: blur(2px);
    }

    /* Drawer */
    #hb-drawer {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 280px;
      background: var(--color-surface, #fff);
      z-index: 700;
      display: flex; flex-direction: column;
      transform: translateX(-100%);
      transition: transform .28s cubic-bezier(.4,0,.2,1);
      box-shadow: 4px 0 24px rgba(0,0,0,.15);
      overflow-y: auto;
    }
    #hb-drawer.open { transform: translateX(0); }

    .hb-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 16px 12px;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }
    .hb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .hb-logo-icon {
      width: 36px; height: 36px;
      background: var(--color-primary, #1b2e5e);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #c9a84c;
      flex-shrink: 0;
    }
    .hb-logo-icon svg { width: 20px; height: 20px; }
    .hb-logo-text { font-size: 15px; font-weight: 700; color: var(--color-primary, #1b2e5e); }
    .hb-logo-sub { font-size: 10px; color: var(--color-text-muted, #64748b); }
    .hb-close {
      width: 32px; height: 32px;
      background: var(--color-bg, #f8fafc);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 8px;
      cursor: pointer; color: var(--color-text, #1e293b);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .hb-close svg { width: 16px; height: 16px; }

    .hb-user {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }
    .hb-user-name { font-size: 13px; font-weight: 600; color: var(--color-text, #1e293b); }
    .hb-user-role { font-size: 11px; color: var(--color-text-muted, #64748b); }

    .hb-nav { flex: 1; padding: 8px 10px; overflow-y: auto; }
    .hb-group-label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--color-text-muted, #64748b);
      padding: 12px 8px 4px;
    }
    .hb-nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 8px;
      text-decoration: none; color: var(--color-text, #1e293b);
      font-size: 13.5px; font-weight: 500;
      transition: background .15s, color .15s;
      margin-bottom: 1px;
    }
    .hb-nav-item svg { width: 18px; height: 18px; flex-shrink: 0; opacity: .7; }
    .hb-nav-item:hover { background: var(--color-bg, #f8fafc); }
    .hb-nav-item.active {
      background: var(--color-primary, #1b2e5e);
      color: #fff;
    }
    .hb-nav-item.active svg { opacity: 1; }
    .hb-divider { height: 1px; background: var(--color-border, #e2e8f0); margin: 8px 0; }

    .hb-footer { padding: 12px 16px; border-top: 1px solid var(--color-border, #e2e8f0); }
    .hb-logout {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 9px 10px; border-radius: 8px;
      background: none; border: none; cursor: pointer;
      color: #dc2626; font-size: 13.5px; font-weight: 500;
    }
    .hb-logout svg { width: 18px; height: 18px; }
    .hb-logout:hover { background: #fef2f2; }
  `;
  document.head.appendChild(style);

  // Botón hamburguesa
  const btn = document.createElement('button');
  btn.id = 'hb-btn';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.innerHTML = `<span></span><span></span><span></span>`;
  btn.onclick = openHamburger;
  document.body.appendChild(btn);

  // Drawer + overlay
  const wrapper = document.createElement('div');
  wrapper.innerHTML = drawerHTML;
  document.body.appendChild(wrapper.children[0]); // overlay
  document.body.appendChild(wrapper.children[0]); // drawer
}

function openHamburger() {
  document.getElementById('hb-overlay').style.display = 'block';
  document.getElementById('hb-drawer').classList.add('open');
}
function closeHamburger() {
  document.getElementById('hb-overlay').style.display = 'none';
  document.getElementById('hb-drawer').classList.remove('open');
}

/**
 * Inyecta el botón de volver atrás en todas las páginas excepto home.
 * @param {string} activePage - id de la página activa
 */
function buildBackBtn(activePage) {
  if (window.self !== window.top) return;
  if (activePage === 'home') return;

  const btn = document.createElement('button');
  btn.id = 'global-back-btn';
  btn.setAttribute('aria-label', 'Volver atrás');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>`;
  btn.onclick = () => history.back();

  const style = document.createElement('style');
  style.textContent = `
    #global-back-btn {
      position: fixed;
      top: 16px;
      left: calc(var(--sidebar-width, 240px) + 16px);
      z-index: 200;
      width: 36px; height: 36px;
      border-radius: 50%;
      background: white;
      border: 1.5px solid var(--color-border, #e2e8f0);
      color: var(--color-text, #1e293b);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 6px rgba(0,0,0,0.10);
      transition: box-shadow 0.15s, border-color 0.15s;
    }
    #global-back-btn:hover {
      border-color: var(--color-primary, #1b2e5e);
      box-shadow: 0 2px 10px rgba(0,0,0,0.14);
    }
    @media (max-width: 768px) {
      #global-back-btn {
        left: 62px;
        top: 12px;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(btn);

  /* En pantallas anchas el contenido puede estar centrado con margin:auto,
     así que alineamos el botón al borde izquierdo real del contenedor. */
  function alignBtn() {
    if (window.innerWidth <= 768) return;
    var inner = document.querySelector('.main-content > *');
    if (!inner) return;
    var rect = inner.getBoundingClientRect();
    if (rect.left > 0) btn.style.left = rect.left + 'px';
  }
  requestAnimationFrame(alignBtn);
  window.addEventListener('resize', alignBtn);
}

/**
 * Inicializa sidebar y bottom nav.
 * @param {string} activePage - id de la página
 */
/**
 * Punto de entrada principal. Inicializa todos los componentes de navegación.
 * Llamar en DOMContentLoaded en cada página protegida.
 *
 * @param {string} activePage - ID de la sección activa (debe existir en NAV_ITEMS)
 *
 * @example
 * document.addEventListener('DOMContentLoaded', () => {
 *   requireAuth();
 *   initNav('eventos');
 *   trackPageView('eventos');
 * });
 */
function initNav(activePage) {
  if (typeof trackPageView === 'function') trackPageView(activePage);
  // Cargar i18n.js si no está disponible
  if (typeof t === 'undefined' && !document.querySelector('script[src*="i18n"]')) {
    const s = document.createElement('script');
    s.src = 'js/i18n.js';
    s.onload = () => { buildSidebar(activePage); buildBottomNav(activePage); buildHamburger(activePage); buildBackBtn(activePage); buildLegalFooter(); };
    document.head.appendChild(s);
    return;
  }
  buildSidebar(activePage);
  buildBottomNav(activePage);
  buildHamburger(activePage);
  buildBackBtn(activePage);
  buildLegalFooter();
}

/**
 * Muestra un toast de notificación.
 * @param {string} message - Texto del mensaje
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number} duration - ms antes de desaparecer (default 3500)
 */
/**
 * Muestra una notificación toast temporal en la esquina inferior de la pantalla.
 * Se puede llamar desde cualquier página que haya cargado nav.js.
 *
 * @param {string} message        - Texto a mostrar
 * @param {'info'|'success'|'warning'|'error'} [type='info'] - Tipo de toast
 * @param {number} [duration=3500] - Duración en milisegundos antes de desaparecer
 *
 * @example
 * showToast('Cambios guardados', 'success');
 * showToast('Error al conectar', 'error', 5000);
 */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span class="toast-message">${message}</span>`;

  toast.addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);

  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  toast.classList.add('hide');
  setTimeout(() => toast.remove(), 350);
}

/* ─── Legal Footer ────────────────────────────────────────────────
   Se inyecta automáticamente al final de .main-content en cada página
   ────────────────────────────────────────────────────────────────── */
/**
 * Genera el HTML del footer legal (Aviso Legal, Privacidad, Cookies).
 * Se inyecta al final del sidebar desktop.
 *
 * @returns {string} HTML string del footer
 */
function buildLegalFooter() {
  if (document.getElementById('legal-footer')) return;

  // Inyectar estilos una sola vez
  if (!document.getElementById('legal-footer-styles')) {
    const s = document.createElement('style');
    s.id = 'legal-footer-styles';
    s.textContent = `
      .legal-footer {
        border-top: 1px solid var(--color-border-light);
        padding: 20px 24px;
        margin-top: 48px;
      }
      .legal-footer-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
      }
      .legal-footer-copy {
        font-size: 0.775rem;
        color: var(--color-text-muted);
      }
      .legal-footer-links {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
      }
      .legal-footer-links a {
        font-size: 0.775rem;
        color: var(--color-text-muted);
        text-decoration: none;
        transition: color 0.15s;
      }
      .legal-footer-links a:hover { color: var(--color-primary); }
      @media (max-width: 480px) {
        .legal-footer-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
      }
    `;
    document.head.appendChild(s);
  }

  const footer = document.createElement('footer');
  footer.id = 'legal-footer';
  footer.className = 'legal-footer';
  footer.innerHTML = `
    <div class="legal-footer-inner">
      <span class="legal-footer-copy">&copy; ${new Date().getFullYear()} Jabad Barcelona</span>
      <nav class="legal-footer-links">
        <a href="privacidad.html">Pol&iacute;tica de Privacidad</a>
        <a href="aviso-legal.html">Aviso Legal</a>
        <a href="cookies.html">Cookies</a>
      </nav>
    </div>`;

  const main = document.querySelector('.main-content');
  if (main) main.appendChild(footer);
}
