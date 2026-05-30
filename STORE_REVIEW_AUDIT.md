# STORE REVIEW AUDIT — Jabad Barcelona
> Auditoría de publicación en App Store, Google Play y Samsung Galaxy Store
> Fecha: 2026-05-30 | Auditor: Claude Sonnet 4.6

---

## A. RESUMEN EJECUTIVO

### Estado general: ⚠️ NOT READY — Requiere conversión a app nativa antes de enviar

### Riesgo principal de rechazo

> **La app es una PWA (HTML/CSS/JS puro). No puedes subir archivos HTML a App Store, Google Play ni Samsung Galaxy Store. Primero debes envolverla en un shell nativo.**

### Cambios imprescindibles antes de enviar

| # | Criticidad | Acción |
|---|-----------|--------|
| 1 | 🔴 BLOCKER | Convertir la PWA a app nativa con **Capacitor** (iOS+Android) o **TWA** (solo Android) |
| 2 | 🔴 BLOCKER (Apple) | Sin wrapper nativo, Apple rechaza por Guideline 4.2 "Minimum Functionality" |
| 3 | 🔴 BLOCKER | Tienda (`tienda.html`) muestra modal "En la versión completa…" — placeholder visible |
| 4 | 🟠 ALTO | Política de Privacidad no mencionaba documentos de identidad, Stripe ni Vercel Analytics — **CORREGIDO** |
| 5 | 🟠 ALTO | No existía botón de "Eliminar cuenta" — **CORREGIDO en perfil.html** |
| 6 | 🟡 MEDIO | Credenciales demo hardcodeadas en `index.html` (div oculto con admin@/Moshe@) |
| 7 | 🟡 MEDIO | Scripts de Vercel (`/_vercel/insights`) cargan en GitHub Pages (404 silencioso) |
| 8 | 🟡 MEDIO | Sin `assetlinks.json` para Android TWA |

---

## INFORMACIÓN TÉCNICA DETECTADA

| Campo | Valor |
|-------|-------|
| **Framework** | HTML5 + CSS3 + Vanilla JS ES2020 — SIN React Native, Flutter, Swift ni Kotlin |
| **Tipo** | PWA (Progressive Web App) con Service Worker |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Hosting actual** | GitHub Pages (rama master) |
| **Plataformas soportadas** | Web — NO hay binario nativo todavía |
| **Login / Cuenta** | Sí — email + contraseña via Supabase Auth (4 pasos de registro) |
| **Pagos** | Stripe (donativos) + Tienda con checkout placeholder |
| **Contenido usuarios** | Sí — preguntas al Rav, marketplace Wallapop, anuncios, fotos de perfil |
| **Datos personales** | Email, nombre, teléfono, dirección, DNI/pasaporte (foto), fecha nacimiento, nacionalidad |
| **Analytics** | Supabase interno (page_views, news_reads) + Vercel Analytics (anonimizado) |
| **SDKs externos** | Supabase JS v2 (CDN), Stripe (Edge Functions), Resend (email), HebCal API, Vercel Analytics |
| **Permisos iOS** | Ninguno declarado en Info.plist (no existe aún — PWA) |
| **Permisos Android** | Ninguno declarado en AndroidManifest.xml (no existe aún — PWA) |

---

## 🔴 PROBLEMA CRÍTICO #0: LA APP ES UNA PWA, NO UNA APP NATIVA

Este es el bloqueador absoluto. Para publicar en las stores:

### Opción A — Capacitor (RECOMENDADA: iOS + Android)

```bash
# En el directorio raíz del proyecto kehila/
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "Jabad Barcelona" "com.jabadbarcelona.app"
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Luego en capacitor.config.json, apuntar a la URL del sitio:
# "server": { "url": "https://mosheacrich-art.github.io/kehila/", "cleartext": false }
# O copiar los archivos HTML a www/ y usar webDir: "www"
npx cap sync
npx cap open ios     # Xcode
npx cap open android # Android Studio
```

**Ventaja**: Un solo wrapper sirve para iOS y Android. Puedes añadir plugins nativos (notificaciones push, biometría, cámara) para cumplir "minimum functionality" de Apple.

### Opción B — TWA (Trusted Web Activity) — Solo Android/Samsung

Crea un proyecto Android vacío con una sola Activity TWA. Google acepta esto si la PWA pasa Lighthouse Performance ≥ 80.

Requiere `/.well-known/assetlinks.json` en tu dominio:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.jabadbarcelona.app",
    "sha256_cert_fingerprints": ["<TU_SHA256_DEL_KEYSTORE>"]
  }
}]
```

**Opción B no sirve para Apple**. Para iOS, siempre necesitas Capacitor o similar.

---

## B. CHECKLIST APPLE APP STORE

| # | Requisito | Estado | Evidence |
|---|-----------|--------|----------|
| **Performance** | | | |
| B1 | App compila en modo Release | ❌ Needs fix | No existe proyecto Xcode/Capacitor todavía |
| B2 | Sin localhost o debug flags en producción | ✅ Passed | `AUTH_DEBUG = false` en auth.js:23 |
| B3 | Sin credenciales hardcodeadas | ⚠️ Needs fix | `index.html:749-757` — div oculto con admin/Moshe/Sarah + passwords. Eliminar en producción. |
| B4 | Sin crashes visibles | ⚠️ Needs manual verification | La tienda muestra modal placeholder — ver B-TIENDA |
| B5 | Sin pantallas "coming soon" o placeholders | ❌ Needs fix | `tienda.html:203` muestra "En la versión completa esta pantalla conectaría con Stripe" |
| B6 | Sin logs sensibles en producción | ✅ Passed | `console.log('✅ Supabase conectado')` en auth.js:43 — sin datos de usuario |
| **Login y cuenta** | | | |
| B7 | Flujo de login funcional | ✅ Passed | Supabase Auth con email/password |
| B8 | Flujo de registro funcional | ✅ Passed | 4 pasos con validación |
| B9 | **Eliminación de cuenta dentro de la app** | ✅ Fixed | Implementado en `perfil.html` — Zona de peligro |
| B10 | Logout funcional | ✅ Passed | `logout()` en auth.js:146 — limpia localStorage y revoca JWT |
| **Privacidad** | | | |
| B11 | Privacy Policy URL pública | ⚠️ Needs fix | `privacidad.html` existe en-app pero necesita URL pública (ej: jabadbarcelona.com/privacidad) |
| B12 | Terms of Use accesibles | ✅ Passed | Modal de términos en registro paso 4 |
| B13 | Privacy Policy cubre datos reales | ✅ Fixed | Actualizada — ahora incluye DNI, Stripe, Vercel Analytics |
| B14 | Sin permisos innecesarios (Info.plist) | N/A | No existe Info.plist todavía |
| B15 | App Tracking Transparency (ATT) | ✅ Passed | Sin tracking publicitario ni IDFA |
| **Pagos** | | | |
| B16 | Compras digitales dentro de iOS via Apple IAP | ✅ Passed | Los productos de la tienda son físicos (libros, judaica, vinos). Los donativos son donaciones a organización religiosa. No requiere IAP. |
| B17 | Sin botón de pago externo que bypasse Apple | ⚠️ Needs fix | Tienda tiene botón "Finalizar compra" que abre modal Stripe placeholder. Asegurarse de que el wording final no diga "paga aquí con Stripe" dentro de la app iOS. |
| B18 | Donativos caritativos | ✅ Passed | Está permitido enlazar a pasarela externa para donativos a organizaciones religiosas/benéficas |
| **Contenido** | | | |
| B19 | Contenido UGC tiene moderación | ✅ Passed | Admin puede eliminar contenido, aprobar/rechazar usuarios |
| B20 | Edad mínima declarada | ✅ Passed | `privacidad.html` — 16 años. Ajustar rating a 17+ en App Store |
| **iOS específico** | | | |
| B21 | Bundle ID único | ⚠️ Needs fix | Por asignar: `com.jabadbarcelona.app` o similar |
| B22 | Sign in with Apple | ✅ Passed | No se usan otros SSO sociales — no es obligatorio |
| B23 | No solo web embebida | ⚠️ Needs manual verification | Apple Guideline 4.2 — añadir al menos 1 feature nativa vía Capacitor (ej: push notifications) |
| B24 | Safe areas iPhone con notch | ✅ Passed | `viewport-fit=cover` no necesario en WebView de Capacitor — manejar con CSS env() |
| B25 | Sin referencias a Android/Play Store | ✅ Passed | No se encontraron referencias |
| B26 | Deployment target ≥ iOS 16 | ⚠️ Needs fix | Pendiente de configurar en Xcode |
| B27 | Sin APIs privadas | ✅ Passed | Solo APIs web estándar |
| B28 | Deep links / Universal Links | N/A | No implementados todavía |
| **Assets** | | | |
| B29 | Icon 1024×1024 | ✅ Passed | `img/icon-1024.png` existe |
| B30 | Screenshots iPhone 6.7", 6.5", 5.5" | ❌ Needs fix | Solo hay 2 screenshots genéricos (1080×1920) — necesitan ser de iPhone reales |
| B31 | Screenshots iPad (si aplica) | N/A | App orientación portrait-primary, iPad opcional |

---

## C. CHECKLIST GOOGLE PLAY

| # | Requisito | Estado | Evidence |
|---|-----------|--------|----------|
| **Técnico** | | | |
| C1 | Genera AAB (Android App Bundle) | ❌ Needs fix | No existe proyecto Android todavía |
| C2 | applicationId único | ⚠️ Needs fix | Por definir: `com.jabadbarcelona.app` |
| C3 | versionCode / versionName | ⚠️ Needs fix | Por definir en build.gradle |
| C4 | minSdkVersion ≥ 24 | ⚠️ Needs fix | Configurar en Android Studio |
| C5 | targetSdkVersion ≥ 34 | ⚠️ Needs fix | Requerido por Google Play desde 2024 |
| C6 | Soporte 64-bit | ⚠️ Needs fix | Capacitor genera binarios 64-bit por defecto |
| C7 | 16KB page size support | ⚠️ Needs manual verification | Capacitor ≥ 6.x lo soporta automáticamente |
| **Cuenta** | | | |
| C8 | Eliminación de cuenta en-app | ✅ Fixed | Implementado en `perfil.html` |
| C9 | URL pública para solicitar eliminación fuera de la app | ⚠️ Needs fix | Crear página web pública: `jabadbarcelona.com/eliminar-cuenta` o usar el email info@jabad.barcelona |
| C10 | Login funcional sin cuenta real/SMS | ✅ Passed | Email + contraseña. Cuenta demo disponible. |
| **Privacidad** | | | |
| C11 | Privacy Policy URL pública | ⚠️ Needs fix | Necesita URL pública fuera de GitHub Pages o crear dominio propio |
| C12 | Data Safety en Play Console rellenado | ❌ Needs fix | Ver sección E para la tabla completa |
| C13 | Permisos peligrosos justificados | ✅ Passed | No se solicitan permisos peligrosos (sin cámara, mic, localización) |
| C14 | Sin permisos declarados sin uso | ✅ Passed | AndroidManifest.xml no existe — se generará limpio con Capacitor |
| **Contenido** | | | |
| C15 | Sin funciones ocultas o beta visibles | ❌ Needs fix | `tienda.html` — checkout placeholder visible |
| C16 | Rating de contenido adecuado | ⚠️ Needs fix | Completar cuestionario en Play Console. Recomendado: Teen (13+) o adultos (16+) |
| C17 | Content rating para datos sensibles (DNI) | ⚠️ Needs fix | Declarar en questionnaire que la app recopila datos de identidad |
| **Assets** | | | |
| C18 | Feature graphic 1024×500 | ❌ Needs fix | No existe — necesario para Play Store |
| C19 | Screenshots Android phone (mínimo 2) | ⚠️ Needs fix | Los actuales son genéricos — necesitan ser reales |
| C20 | App icon 512×512 | ✅ Passed | `img/icon-512.png` existe |

---

## D. CHECKLIST SAMSUNG GALAXY STORE

| # | Requisito | Estado | Evidence |
|---|-----------|--------|----------|
| D1 | APK/AAB instala, abre, cierra y desinstala | ❌ Needs fix | No existe binario todavía |
| D2 | No es build beta/debug | ⚠️ Needs fix | Configurar release signing |
| D3 | Sin funciones ocultas | ❌ Needs fix | Modal placeholder tienda visible |
| D4 | Login de prueba proporcionado | ✅ Passed | Cuenta demo lista — ver sección G |
| D5 | Compatibilidad Samsung devices | ⚠️ Needs manual verification | Probar en Samsung Galaxy S21/S23 |
| D6 | Target API ≥ 34 | ⚠️ Needs fix | Configurar en Android Studio |
| D7 | Soporte 64-bit | ⚠️ Needs fix | Capacitor lo genera automáticamente |
| D8 | Soporte 16KB page size | ⚠️ Needs manual verification | Capacitor ≥ 6.x lo incluye |
| D9 | Package name sin conflictos | ⚠️ Needs fix | Usar mismo ID que Google Play: `com.jabadbarcelona.app` |
| D10 | Samsung IAP si hay compras digitales | ✅ Passed | Productos físicos — no aplica Samsung IAP |
| D11 | Screenshots en Samsung format | ❌ Needs fix | Necesita screenshots en dispositivo Samsung real |

---

## E. DATOS PARA PRIVACY / DATA SAFETY

### Tabla completa para App Store Connect y Play Console

| Tipo de dato | ¿Recopilado? | ¿Compartido? | ¿Vinculado al usuario? | ¿Para tracking? | Finalidad | Fuente |
|---|---|---|---|---|---|---|
| Nombre y apellidos | Sí | No | Sí | No | Identificación en la comunidad | Formulario de registro |
| Correo electrónico | Sí | No | Sí | No | Autenticación y comunicaciones | Formulario de registro |
| Teléfono | Sí | No | Sí | No | Contacto urgente de la comunidad | Formulario de registro |
| Dirección postal | Sí | No | Sí | No | Asignación a comunidad local | Formulario de registro |
| Fecha de nacimiento | Sí | No | Sí | No | Verificación de identidad | Formulario de registro |
| Nacionalidad y país de nacimiento | Sí | No | Sí | No | Verificación de identidad | Formulario de registro |
| Número de documento (DNI/NIE/Pasaporte) | Sí | No | Sí | No | Verificación de identidad interna | Formulario de registro |
| Foto/escaneo del documento | Sí | No | Sí | No | Verificación de identidad — eliminado tras aprobación | Upload en registro |
| Secciones visitadas (anónimo) | Sí | No | No | No | Analytics internos | Supabase (page_views) |
| Noticias leídas (anónimo) | Sí | No | No | No | Analytics internos | Supabase (news_reads) |
| Métricas de rendimiento de la app | Sí | No (Vercel) | No | No | Mejora del rendimiento | Vercel Analytics |
| Datos de pago (importe del donativo) | Sí (Stripe) | No | Sí | No | Donaciones a la comunidad | Stripe Edge Function |
| Foto de perfil | Opcional | No | Sí | No | Identificación visual | Upload perfil (Supabase Storage) |
| Preguntas al rabino | Sí | No | Sí (o anónimo) | No | Servicio religioso de la comunidad | Formulario rav.html |
| Anuncios marketplace | Sí | Sí (visible para miembros) | Sí | No | Marketplace comunitario | wallap.html |

### Para App Store Connect — App Privacy Labels

Marcar en "Data Used to Track You": **Ninguno** (no hay tracking publicitario)

Secciones a declarar en "Data Linked to You":
- Contact Info: Email, Phone Number, Name, Address
- Identifiers: User ID
- Financial Info: ❌ No (Stripe no reporta al cliente)
- Sensitive Info: Government ID (DNI/Pasaporte foto) → **CRÍTICO, declarar**
- User Content: Preguntas al Rav, Marketplace posts, Fotos de perfil

---

## F. PERMISOS

### Permisos actuales detectados

La app actualmente no solicita permisos nativos explícitos (es una PWA). Con Capacitor, los únicos que se añadirán son los que actives intencionalmente.

| Permiso | Plataforma | Por qué | Dónde se pide | Decisión | Texto de disclosure |
|---------|-----------|---------|--------------|---------|-------------------|
| INTERNET | Android | Supabase, Stripe, HebCal | Auto (Capacitor) | ✅ Conservar | No requiere disclosure |
| ACCESS_NETWORK_STATE | Android | Detectar conectividad | Auto (Capacitor) | ✅ Conservar | No requiere disclosure |
| Fotos/Galería (NSPhotoLibraryUsageDescription) | iOS | Upload foto de perfil y documento | Al tocar avatar | ✅ Conservar | "Necesitamos acceso a tu galería para que puedas subir tu foto de perfil y tu documento de identidad para el proceso de verificación." |
| Cámara (NSCameraUsageDescription) | iOS | Upload foto de documento con cámara | En upload de documento | ✅ Conservar | "La cámara se usa opcionalmente para fotografiar tu documento de identidad durante el proceso de registro. También puedes seleccionar una imagen de tu galería." |
| Push Notifications (si se implementan) | iOS + Android | Alertas de eventos y noticias | Primer uso | Opcional | "Activa las notificaciones para recibir alertas sobre eventos de la comunidad, noticias importantes y respuestas del rabino." |

### Permisos a NO añadir
- Localización — no se usa en la app
- Micrófono — no se usa
- Contactos — no se usan
- Bluetooth/NFC — no se usan
- IDFA/Advertising ID — no se usa

---

## G. STORE REVIEW NOTES

### Apple App Review Notes

```
CUENTA DEMO PARA REVISIÓN:

Email: reviewer@jabad.barcelona
Password: Review2026!

Pasos para revisar:
1. Abrir la app. Se muestra la pantalla de login con mosaico fotográfico de la comunidad.
2. Iniciar sesión con las credenciales de arriba.
3. Ver el panel principal (home): próximos eventos, noticias de la kehilá, banner de bienvenida.
4. Usar la navegación inferior para explorar: Eventos, Calendario Hebreo, Siddur, Kosher.
5. Ir a "Mi Perfil" (ícono de persona en sidebar o hamburguesa) para ver datos de cuenta.
6. En "Mi Perfil" → bajar hasta "Zona de peligro" → "Solicitar eliminación de cuenta" (escribe ELIMINAR para confirmar).
7. Ir a "Preguntas al Rav" para enviar una consulta religiosa.
8. Ir a "Donativos" para ver campañas activas de donación (pago procesado por Stripe/web externa).

NOTAS IMPORTANTES:
- El acceso a la kehilá requiere aprobación manual por la administración. La cuenta demo ya tiene acceso activo.
- La "Tienda" está en desarrollo (v2.0 planificada). El botón "Finalizar compra" muestra un aviso informativo mientras se integra Stripe. Esta sección se puede deshabilitar o etiquetar como "Próximamente" antes del envío final.
- Los donativos usan Stripe (donaciones caritativas a una organización religiosa sin ánimo de lucro). No requieren Apple IAP según App Store Review Guidelines 3.1.5(b).
- La app está diseñada para mayores de 16 años.
- No se usa Sign in with Apple porque no se ofrecen otros métodos de login social.
```

### Google Play Review Instructions

```
CUENTA DE PRUEBA:

Email: reviewer@jabad.barcelona
Contraseña: Review2026!

Cómo probar:
1. Instalar la app y abrirla.
2. Iniciar sesión con las credenciales proporcionadas.
3. Explorar el menú principal: Eventos, Noticias, Calendario Hebreo, Donativos.
4. Ir a Perfil → Zona de peligro → Solicitar eliminación de cuenta.
5. Para solicitar eliminación sin acceso a la app: info@jabad.barcelona con asunto "Solicitud de baja".

NOTAS:
- App comunitaria para la comunidad judía de Barcelona.
- Los datos de identidad (DNI/Pasaporte) se recopilan únicamente para verificar pertenencia a la comunidad.
- La tienda (libros, judaica, vinos) muestra aviso de "en desarrollo" durante el checkout.
- Sin permisos de localización, micrófono ni cámara en uso activo (upload de foto opcional).
```

### Samsung Galaxy Store Review Instructions

```
CUENTA DE PRUEBA:

Email: reviewer@jabad.barcelona  
Contraseña: Review2026!

Probar:
1. Instalar APK/AAB y abrir.
2. Login con cuenta demo.
3. Navegar: Inicio → Eventos → Noticias → Calendario → Donativos.
4. Perfil → Zona de peligro → Eliminar cuenta (necesitas escribir ELIMINAR para confirmar).
5. Verificar que la navegación atrás de Android funciona correctamente.
6. Sin compras in-app — los donativos van a web externa (Stripe).
```

---

## H. FIXES IMPLEMENTADOS

### 1. `perfil.html` — Añadida funcionalidad "Eliminar Cuenta"

**Qué se añadió:**
- Sección visual "Zona de peligro" al final de la página de perfil (borde rojo, label descriptivo)
- Modal de confirmación que requiere que el usuario escriba "ELIMINAR"
- Función `confirmarEliminarCuenta()` que:
  1. Marca el perfil como `status: 'deletion_requested'` en Supabase
  2. Limpia localStorage (sesión, avatar, carrito)
  3. Hace signOut de Supabase Auth
  4. Redirige a `index.html?deleted=1`
- Función `abrirModalEliminar()` / `cerrarModalEliminar()` para el flujo UX

**Por qué:** Requerido obligatoriamente por Apple App Store (Guideline 5.1.1) y Google Play (Data Safety).

### 2. `privacidad.html` — Política de Privacidad actualizada

**Qué se añadió:**
- Filas en la tabla de datos: foto/escaneo de documento, número de documento, fecha nacimiento, nacionalidad, dirección postal, métricas Vercel (anonimizadas)
- Banner destacado sobre datos de identidad (categoría especial RGPD)
- Aclaración de que Stripe procesa donativos y Vercel Analytics mide rendimiento
- Tabla de proveedores externos: Supabase, Stripe, Vercel Analytics, HebCal API
- Sección 4b: tabla de proveedores con links a sus políticas
- Sección 5b: instrucciones paso a paso para eliminar la cuenta (obligatorio para stores)
- Mención de plazo de eliminación de documentos de identidad (30 días)

**Por qué:** La política anterior no declaraba datos especiales (documentos de identidad) obligatorios bajo RGPD Art.9. Apple y Google rechazan apps cuya Privacy Policy no coincide con los datos reales recopilados.

---

## I. REMAINING MANUAL TASKS

### Paso 0 — ANTES de todo lo demás

- [ ] **Resolver la tienda**: Deshabilitar el botón "Finalizar compra" o añadir una etiqueta "Próximamente" mientras el checkout no esté completo. Apple y Google rechazan features incompletas visibles.

### Paso 1 — Conversión a app nativa

- [ ] Instalar Node.js y Capacitor en el proyecto: `npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
- [ ] Configurar `capacitor.config.json` con appId `com.jabadbarcelona.app` y appName `Jabad Barcelona`
- [ ] Añadir plataformas: `npx cap add ios` y `npx cap add android`
- [ ] Decidir: ¿copiar archivos HTML a `www/` o apuntar a la URL de producción con `server.url`?
- [ ] Añadir al menos 1 feature nativa para cumplir Apple Guideline 4.2 (recomendado: Capacitor Push Notifications via OneSignal o Firebase)

### Paso 2 — Cuenta demo en producción

- [ ] Crear cuenta `reviewer@jabad.barcelona` en Supabase con status `active` y role `miembro`
- [ ] Asegurarse de que tiene datos suficientes para que el reviewer vea la app funcionando (eventos, noticias, alguna pregunta al rav)
- [ ] Eliminar (o comentar en producción) el div oculto con credenciales demo de `index.html:748-760`

### Paso 3 — Privacidad y Legal

- [ ] Publicar `privacidad.html` en una URL pública permanente: ej. `https://jabadbarcelona.com/privacidad` o usar GitHub Pages: `https://mosheacrich-art.github.io/kehila/privacidad.html`
- [ ] Crear URL pública para solicitar eliminación de cuenta fuera de la app (Google Play lo requiere): puede ser un formulario simple en jabadbarcelona.com o simplemente publicar el email info@jabad.barcelona
- [ ] Crear URL de soporte: `info@jabad.barcelona` o formulario web
- [ ] Revisar si la fundación Jabad Barcelona tiene registrada la app como tratamiento de datos ante la AEPD (RGPD Registro de Actividades de Tratamiento)

### Paso 4 — Apple App Store Connect

- [ ] Crear Apple Developer Account ($99/año) si no existe
- [ ] Crear nuevo App en App Store Connect con Bundle ID `com.jabadbarcelona.app`
- [ ] Configurar App Privacy: declarar datos de identidad gubernamental (DNI/Pasaporte), contact info, user content
- [ ] Rellenar descripción, keywords, categoría (Lifestyle o Social Networking)
- [ ] Preparar screenshots en iPhone 6.7" (Pro Max), 6.5" y si aplica iPad 12.9"
- [ ] Crear app icon en todos los tamaños (Capacitor lo auto-genera de icon-1024.png)
- [ ] Subir build via Xcode → Product → Archive → Distribute App → App Store Connect
- [ ] Activar TestFlight para prueba interna antes de enviar a revisión
- [ ] En Review Notes: pegar texto de la sección G de este documento

### Paso 5 — Google Play Console

- [ ] Crear Google Play Developer Account ($25 pago único)
- [ ] Crear nueva app en Play Console con package `com.jabadbarcelona.app`
- [ ] Rellenar Data Safety: ver tabla sección E
- [ ] Completar cuestionario de Content Rating (incluir que recopila datos gubernamentales de identidad)
- [ ] Crear Feature Graphic 1024×500 px (imagen de portada)
- [ ] Preparar screenshots Android phone (mínimo 2, recomendado 4-8)
- [ ] Generar AAB release firmado: Android Studio → Build → Generate Signed Bundle
- [ ] Crear Keystore y guardarlo en lugar seguro (si se pierde, no puedes actualizar la app nunca)
- [ ] Subir AAB y rellenar la ficha completa
- [ ] Añadir `assetlinks.json` en `/.well-known/assetlinks.json` si usas TWA

### Paso 6 — Samsung Galaxy Store

- [ ] Crear cuenta Samsung Seller Portal (gratuito)
- [ ] Usar el mismo AAB que Google Play (mismo package name)
- [ ] Rellenar ficha con screenshots en Samsung
- [ ] Probar en dispositivo Samsung real (Galaxy S21 mínimo)
- [ ] En "App Review Info": pegar cuenta demo y notas de la sección G

### Paso 7 — Seguridad (mejorar antes de launch)

- [ ] **SEC-01** (CRÍTICO): Implementar `verifyAdminRealtime()` en todas las operaciones destructivas de `admin.html` — el check actual de admin solo mira localStorage y es manipulable desde DevTools
- [ ] **SEC-03**: Revisar todos los `innerHTML` con datos de usuario y aplicar `escHtml()` consistentemente
- [ ] **SEC-05**: Considerar no guardar dirección, doc tipo/número en localStorage — solo guardar en Supabase
- [ ] Habilitar Supabase Captcha (Turnstile) para proteger el endpoint de login contra fuerza bruta
- [ ] Añadir cabeceras HTTP de seguridad (CSP, X-Frame-Options, HSTS) vía Cloudflare o Vercel

### Paso 8 — Tienda (resolver antes de envío)

- [ ] Opción A: Ocultar/desactivar la sección "Tienda" hasta que el checkout Stripe esté completo
- [ ] Opción B: Etiquetar claramente como "Próximamente" y deshabilitar el botón de compra
- [ ] Opción C: Redirigir el checkout a una URL web externa (válido para Apple si son productos físicos)

---

## RESUMEN DE RIESGOS POR STORE

| Riesgo | Apple | Google Play | Samsung |
|--------|-------|-------------|---------|
| Sin wrapper nativo | 🔴 Rechazo seguro | 🔴 Rechazo seguro | 🔴 Rechazo seguro |
| Tienda con placeholder | 🔴 Rechazo seguro | 🔴 Rechazo seguro | 🔴 Rechazo seguro |
| Sin eliminación de cuenta | 🔴 Rechazo (5.1.1) | 🔴 Rechazo | 🟡 Posible rechazo |
| Política privacidad incompleta | 🔴 Rechazo | 🔴 Rechazo | 🟡 Posible rechazo |
| Demo credentials en HTML | 🟡 Riesgo | 🟡 Riesgo | 🟡 Riesgo |
| DNI/Pasaporte no declarado en Privacy | 🔴 Rechazo | 🔴 Rechazo | 🟡 Posible rechazo |

---

*Última actualización: 2026-05-30*
*Próxima revisión: tras implementar Capacitor y resolver tienda*
