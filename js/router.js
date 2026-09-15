/**
 * @file router.js
 * @description Router SPA piloto (Tramo 1): home.html, eventos.html, noticias.html.
 *
 * Intercepta navegaciones internas entre estas 3 páginas (vía el hook
 * window.__spaTryNavigate, consumido por el listener de clics ya existente
 * en nav.js) y las resuelve con un fetch + swap de <body>, sin recarga
 * completa. Fuera de estas 3 páginas, todo sigue funcionando igual que
 * antes (recarga normal con el overlay de nav.js).
 *
 * LIMPIEZA: los intervals/timeouts y los listeners de document/window que
 * registre el script de la página se registran automáticamente (parcheando
 * setInterval/setTimeout/addEventListener) y se limpian antes de entrar a
 * la siguiente página, para que no se acumulen en navegaciones repetidas
 * dentro del mismo documento.
 */
(function () {
  const SPA_PAGES = ['home.html', 'eventos.html', 'noticias.html'];

  // Scripts compartidos que ya están cargados en el documento persistente:
  // no se vuelven a añadir en cada navegación. Cualquier <script src> que
  // no matchee aquí (ej. js/noticias.js) se trata como propio de la página
  // y se reinyecta fresco en cada visita.
  const PERSISTENT_SRC = [
    /supabase-js/, /stripe\.com/, /_vercel\//,
    /js\/data\.js/, /js\/i18n\.js/, /js\/auth\.js/, /js\/nav\.js/,
    /js\/familia\.js/, /js\/media\.js/, /js\/router\.js/, /js\/push\.js/
  ];

  function fileOf(pathname) {
    return pathname.split('/').pop() || 'index.html';
  }

  function isSpaPage(pathname) {
    const file = fileOf(pathname);
    return SPA_PAGES.includes(file) ? file : null;
  }

  let tracking = null;

  function installTracking() {
    tracking = { intervals: [], timeouts: [], listeners: [] };

    const origSI = window.setInterval.bind(window);
    window.setInterval = function (fn, ms, ...rest) {
      const id = origSI(fn, ms, ...rest);
      tracking.intervals.push(id);
      return id;
    };

    const origST = window.setTimeout.bind(window);
    window.setTimeout = function (fn, ms, ...rest) {
      const id = origST(fn, ms, ...rest);
      tracking.timeouts.push(id);
      return id;
    };

    [document, window].forEach((target) => {
      const origAdd = target.addEventListener.bind(target);
      target.addEventListener = function (type, fn, opts) {
        tracking.listeners.push({ target, type, fn, opts });
        return origAdd(type, fn, opts);
      };
    });
  }

  function cleanupTracked() {
    if (!tracking) return;
    tracking.intervals.forEach((id) => clearInterval(id));
    tracking.timeouts.forEach((id) => clearTimeout(id));
    tracking.listeners.forEach(({ target, type, fn, opts }) => {
      try { target.removeEventListener(type, fn, opts); } catch (_) {}
    });
    tracking = null;
  }

  function isPersistentSrc(src) {
    return PERSISTENT_SRC.some((re) => re.test(src));
  }

  function runScripts(scripts) {
    return scripts.reduce((chain, old) => chain.then(() => {
      if (old.src) {
        if (isPersistentSrc(old.src)) return;
        return new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = old.src;
          s.onload = resolve;
          s.onerror = resolve;
          document.body.appendChild(s);
        });
      }
      const s = document.createElement('script');
      s.textContent = old.textContent;
      document.body.appendChild(s);
    }), Promise.resolve());
  }

  async function navigate(file, url, push) {
    let html;
    try {
      const res = await fetch(url.href, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('bad status ' + res.status);
      html = await res.text();
    } catch (_) {
      // Fallback seguro: navegación normal completa.
      window.location.href = url.href;
      return;
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const scripts = Array.from(doc.body.querySelectorAll('script'));
    scripts.forEach((s) => s.remove());

    cleanupTracked();

    document.title = doc.title;
    document.body.innerHTML = doc.body.innerHTML;
    document.body.className = doc.body.className;
    document.body.classList.remove('page-ready');

    if (push) history.pushState({ spa: true, file }, '', url.href);
    currentFile = file;

    installTracking();
    await runScripts(scripts);
    document.body.classList.add('page-ready');
    window.scrollTo(0, 0);
  }

  let currentFile = fileOf(location.pathname);

  window.__spaTryNavigate = function (url, href) {
    const targetFile = isSpaPage(url.pathname);
    if (!targetFile) return false;
    if (!isSpaPage(currentFile)) return false;
    if (url.pathname === location.pathname) return false;
    navigate(targetFile, url, true);
    return true;
  };

  window.addEventListener('popstate', () => {
    const file = isSpaPage(location.pathname);
    if (file && isSpaPage(currentFile)) {
      navigate(file, new URL(location.href), false);
    } else {
      window.location.reload();
    }
  });

  installTracking();
})();
