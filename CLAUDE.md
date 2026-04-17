# CLAUDE.md — Kehilá Web App
> Documentación técnica interna. Actualizar con cada cambio relevante de arquitectura.
> Última revisión: 2026-04-17 — Auditoría y documentación completa del código

---

## 1. Visión general

**Kehilá** es una PWA (Progressive Web App) estática para comunidades judías en España.
Permite a los miembros acceder a eventos, noticias, servicios comunitarios y al rabino.
Los administradores gestionan usuarios, contenido y subgrupos desde un panel dedicado.

**Stack:**
- Frontend: HTML5 + CSS3 + JavaScript ES2020 (vanilla, sin frameworks)
- Backend: Supabase — PostgreSQL + Auth + Storage
- Hosting: GitHub Pages (estático, rama master)
- PWA: Service Worker (sw.js) con cache-first para assets

---

## 2. Estructura de archivos

```
kehila/
├── CLAUDE.md              <- Este archivo (arquitectura y guías)
├── PROGRESO.md            <- Log de cambios de producto (no técnico)
├── supabase_analytics.sql <- DDL para tablas de analytics
├── manifest.json          <- Web app manifest (PWA)
├── sw.js                  <- Service Worker
│
├── css/
│   ├── main.css           <- Variables CSS, reset, layout base
│   ├── components.css     <- Componentes reutilizables
│   └── pages.css          <- Estilos específicos por página
│
├── js/
│   ├── auth.js            <- [CRÍTICO] Autenticación, sesión, guards de ruta
│   ├── nav.js             <- Sidebar y bottom nav (todas las páginas)
│   ├── analytics.js       <- Dashboard de métricas del panel admin
│   ├── data.js            <- [TEMP] Datos mock — eliminar en producción completa
│   ├── i18n.js            <- Internacionalización (es/en/he)
│   ├── media.js           <- Upload de imágenes a Supabase Storage
│   ├── noticias.js        <- Lógica de noticias.html
│   └── registro.js        <- Flujo de registro en 4 pasos
│
└── *.html                 <- Una página por sección
    ├── index.html         <- Login
    ├── home.html          <- Dashboard del usuario
    ├── admin.html         <- [CRÍTICO] Panel de administración
    └── ...
```

---

## 3. Tablas Supabase

| Tabla | Descripción | RLS activo |
|---|---|---|
| profiles | Perfil extendido del usuario | ✅ Activo |
| eventos | Eventos de la comunidad | ✅ Activo |
| noticias | Artículos de noticias | ✅ Activo |
| campanas | Campañas de donación | ✅ Activo |
| donaciones | Donaciones de usuarios | ✅ Activo |
| inscripciones | Inscripciones a eventos | ✅ Activo |
| subgrupos | Grupos dentro de la comunidad | ✅ Activo |
| subgrupo_miembros | Relación N:M usuarios/subgrupos | ✅ Activo |
| anuncios | Anuncios del marketplace | ✅ Activo |
| wallap_anuncios | Marketplace tipo Wallapop | ✅ Activo |
| negocios | Directorio de negocios | ✅ Activo |
| preguntas_rav | Consultas al rabino | ✅ Activo |
| servicios_solicitudes | Solicitudes de servicios | ✅ Activo |
| banner_slides | Banners del home | ✅ Activo |
| calendario_eventos | Eventos del calendario | ✅ Activo |
| horarios | Horarios de servicios | ✅ Activo |
| shiurim | Clases y contenido educativo | ✅ Activo |
| page_views | Analytics de visitas | ✅ Activo |
| news_reads | Analytics de lecturas | ✅ Activo |
| citas | Citas con el rabino | ✅ Activo |
| inscripciones_voluntariado | Inscripciones voluntariado | ✅ Activo |
| voluntariados | Oportunidades de voluntariado | ✅ Activo |

### Roles de usuario

| Rol | Acceso |
|---|---|
| admin | Panel completo de administración |
| miembro | Todas las páginas excepto admin |
| pending | Solo home con banner de pendiente |
| banned | Redirige a index con mensaje |

### Credenciales

La anon key puede estar en el cliente — es pública por diseño de Supabase.
Las políticas RLS DEBEN estar activas para que sea seguro.
NUNCA poner la service_role key en el frontend.

```
SUPABASE_URL      = https://vvrvuhugpvqytelhsdnk.supabase.co
SUPABASE_ANON_KEY = ver js/auth.js
```

Para rotar la key: Supabase Dashboard → Settings → API → Regenerate anon key.

---

## 4. Flujo de autenticación

```
index.html (login)
    |
    v
auth.js -> sb.auth.signInWithPassword()
    |
    +-- Error -> mostrar en UI
    +-- Baneado -> signOut() + error
    +-- OK -> guardar sessionData en localStorage['kehila_user']
              |
              v
           home.html
              |
    Cada página llama requireAuth() en DOMContentLoaded
              |
    admin.html llama requireAdmin() [ver SEC-01]
```

### Sesión en localStorage

```javascript
{
  userId:    "uuid-de-supabase",
  name:      "Nombre Apellido",
  email:     "user@example.com",
  role:      "admin" | "miembro",
  status:    "active" | "pending" | "banned",
  comunidad: "Jabad Barcelona",
  initials:  "NA",
  loginAt:   "2026-04-17T10:00:00.000Z",
  source:    "supabase"
}
```

---

## 5. Cómo añadir una nueva página

1. Copiar estructura base de home.html
2. Scripts en este orden:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="js/auth.js"></script>
<script src="js/nav.js"></script>
```
3. En DOMContentLoaded:
```javascript
requireAuth();
initNav('id-pagina');
renderPageHeader();
trackPageView('id');  // opcional
```
4. Añadir entrada en NAV_ITEMS en nav.js si aparece en el menú

---

## 6. Cómo añadir una tabla Supabase

1. Crear en Supabase Dashboard
2. Activar RLS inmediatamente: ALTER TABLE ... ENABLE ROW LEVEL SECURITY
3. Crear políticas necesarias:
   - SELECT: auth.uid() IS NOT NULL (usuarios autenticados)
   - INSERT/UPDATE/DELETE: verificar rol admin si aplica
4. Documentar en este archivo (sección 3)

---

## 7. Panel admin (admin.html)

### Pestañas y funciones de carga

| Tab | ID | Función de carga |
|---|---|---|
| Resumen | resumen | initResumen() (auto) |
| Usuarios | usuarios | cargarUsuariosReales() |
| Eventos | eventos | loadEventosAdmin() |
| Noticias | noticias | loadNoticiasAdmin() |
| Marketplace | marketplace | loadMarketplaceAdmin() |
| Solicitudes | solicitudes | renderPendingSolicitudes() |
| Preguntas Rav | preguntas | loadPreguntas() |
| Subgrupos | subgrupos | loadSubgrupos() |
| Analytics | analytics | loadAnalyticsDashboard() |

### Regla XSS crítica

SIEMPRE usar escHtml() al insertar datos de usuario en innerHTML:
```javascript
// MAL — vulnerabilidad XSS
el.innerHTML = `<span>${user.name}</span>`;

// BIEN
el.innerHTML = `<span>${escHtml(user.name)}</span>`;
```

---

## 8. Problemas de seguridad conocidos

| # | Problema | Criticidad | Estado |
|---|---|---|---|
| SEC-01 | Admin check solo client-side (localStorage) | CRITICO | Pendiente — usar verifyAdminRealtime() |
| SEC-02 | Sin RLS en tablas principales | CRITICO | ✅ RESUELTO 2026-04-17 — 19 tablas protegidas |
| SEC-03 | XSS en varios innerHTML | CRITICO | Parcialmente resuelto |
| SEC-04 | Sin cabeceras HTTP (CSP, X-Frame) | ALTO | Pendiente — configurar via Cloudflare |
| SEC-05 | PII en localStorage sin cifrar | ALTO | Pendiente |
| SEC-06 | Sin tokens CSRF | ALTO | Pendiente |
| SEC-07 | SW cachea respuestas autenticadas | MEDIO | Pendiente |
| SEC-08 | Password mínimo 6 chars (NIST: 8+) | MEDIO | Pendiente |
| SEC-09 | Sin rate limiting en auth | MEDIO | Pendiente — configurar en Supabase |
| SEC-10 | data.js con mock data en producción | MEDIO | Pendiente eliminar |
| SEC-11 | usuario_id como text (sin FK ni validación) | ALTO | ✅ RESUELTO 2026-04-17 — migrado a uuid + FK |
| SEC-12 | RLS pendiente en citas, inscripciones_voluntariado, voluntariados | MEDIO | ✅ RESUELTO 2026-04-17 — tablas creadas con RLS |

### Solución para SEC-01 (más urgente)

Activar RLS en profiles:
```sql
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (auth.uid() = id);
```
Usar verifyAdminRealtime() de auth.js en operaciones destructivas.

---

## 9. RGPD (España)

- Datos religiosos = categoría especial (Art. 9 RGPD)
- Checkboxes de consentimiento en paso 4 del registro (ck1-ck4)
- Sanciones hasta 20M€ o 4% facturación global (LOPDGDD)
- Notificación de brechas a AEPD: plazo 72 horas
- Pendiente: función de borrado de cuenta (derecho al olvido)
- Pendiente: política de retención de datos

---

## 10. Despliegue

Push a master = deploy automático en ~1-2 minutos vía GitHub Pages.

```bash
git add .
git commit -m "descripción"
git push origin master
```

Para invalidar caché del SW: cambiar versión en sw.js de kehila-v3 a kehila-v4.

---

## 11. Contacto y accesos

| Recurso | URL |
|---|---|
| Repositorio | https://github.com/mosheacrich-art/kehila |
| Supabase | https://supabase.com/dashboard/project/vvrvuhugpvqytelhsdnk |
| GitHub Pages | https://mosheacrich-art.github.io/kehila/ |
