# Setup Capacitor + Push Notifications — Jabad Barcelona
> Guía paso a paso. Seguir en orden.

---

## PASO 1 — Instalar dependencias

```bash
# En el directorio raíz del proyecto (donde está package.json)
npm install

# Añadir plataformas nativas
npx cap add ios
npx cap add android

# Copiar web app al shell nativo
npx cap sync
```

---

## PASO 2 — Crear proyecto Firebase

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Crear proyecto → Nombre: **Jabad Barcelona**
3. **Añadir app Android**:
   - Package: `com.jabadbarcelona.app`
   - Descargar `google-services.json`
   - Colocar en: `android/app/google-services.json`
4. **Añadir app iOS**:
   - Bundle ID: `com.jabadbarcelona.app`
   - Descargar `GoogleService-Info.plist`
   - Abrir Xcode → arrastrar el `.plist` dentro del grupo `App/`

---

## PASO 3 — Configurar APNs (solo iOS)

En Firebase Console → Project Settings → Cloud Messaging → iOS app:

1. **APNs Authentication Key** (recomendado):
   - Apple Developer → Certificates, IDs & Profiles → Keys → Create key
   - Activar **Apple Push Notifications service (APNs)**
   - Descargar `.p8`, copiar Key ID y Team ID
   - Subir a Firebase
2. O bien: usa APNs Certificates (`.p12`) si ya los tienes

---

## PASO 4 — Credenciales Firebase en Supabase

Estas credenciales permiten a la Edge Function `send-push` enviar notificaciones FCM.

### 4a. Descargar Service Account

Firebase Console → Project Settings → Service Accounts → **Generate new private key**

Descarga el JSON. Contiene `client_email`, `private_key`, `project_id`.

### 4b. Guardar como Secrets en Supabase

Supabase Dashboard → Edge Functions → Secrets:

```
FIREBASE_SERVICE_ACCOUNT_JSON  = <contenido completo del JSON descargado>
FIREBASE_PROJECT_ID            = jabad-barcelona-prod   (tu project_id del JSON)
```

### 4c. Deploy de la Edge Function

```bash
# Instalar Supabase CLI si no está
npm install -g supabase

# Login
supabase login

# Linkear al proyecto
supabase link --project-ref vvrvuhugpvqytelhsdnk

# Deploy
supabase functions deploy send-push
```

---

## PASO 5 — Crear tablas en Supabase

Ejecutar en Supabase SQL Editor el contenido de `supabase_push_tokens.sql`:

```sql
-- Copiar y pegar el contenido del archivo supabase_push_tokens.sql
```

---

## PASO 6 — Abrir en Xcode y Android Studio

```bash
npx cap open ios      # Abre Xcode
npx cap open android  # Abre Android Studio
```

### En Xcode:
- Seleccionar el target `App`
- Signing & Capabilities → + Capability → **Push Notifications**
- Signing & Capabilities → + Capability → **Background Modes** → activar "Remote notifications"
- Configurar Team y Bundle ID correcto
- Product → Archive para generar el build de Release

### En Android Studio:
- Build → Generate Signed Bundle/APK → Android App Bundle
- Crear Keystore si no existe — ⚠️ **guardar en lugar seguro, sin él no puedes actualizar la app**
- Seleccionar release build variant
- Generar el `.aab`

---

## PASO 7 — Notificaciones automáticas al crear eventos

### Opción A: Supabase Database Webhook (más simple)

Supabase Dashboard → Database → Webhooks → Create:

```
Nombre:   notify_new_evento
Table:    eventos
Event:    INSERT
Method:   POST
URL:      https://vvrvuhugpvqytelhsdnk.supabase.co/functions/v1/send-push
Headers:
  Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
  Content-Type: application/json
Body:
  {
    "title": "Nuevo evento: {{record.titulo}}",
    "body": "{{record.descripcion}}",
    "tipo": "evento",
    "id": "{{record.id}}"
  }
```

⚠️ La Edge Function `send-push` debe aceptar service_role sin validar rol admin.
Añadir en `send-push/index.ts` una comprobación especial para peticiones de webhook:

```typescript
// Si el header X-Webhook-Source está presente y el token es service_role, saltarse la verificación de rol
const isWebhook = req.headers.get('X-Webhook-Source') === 'supabase-db';
```

O simplemente: crear una Edge Function separada `auto-push-evento` que no requiera rol admin.

### Opción B: Llamar send-push desde el código de creación de evento en admin.html

En la función que crea el evento, tras el INSERT exitoso:

```javascript
// Ya existe session del admin
const { data: { session } } = await sb.auth.getSession();
await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: `📅 Nuevo evento: ${titulo}`,
    body: descripcion.slice(0, 100),
    tipo: 'evento',
    id: nuevoEventoId,
  }),
});
```

---

## PASO 8 — Verificar en dispositivo físico

Las notificaciones push **no funcionan en simulador/emulador**. Probar siempre en:
- iPhone físico (Debug o TestFlight)
- Android físico (APK de debug o release)

### Test rápido desde admin:
1. Abrir admin.html → tab "Push"
2. Título: "Test notificación"
3. Mensaje: "¿Funciona? ¡Bien!"
4. Enviar → ver en el móvil

---

## Resumen de archivos creados/modificados

| Archivo | Qué hace |
|---------|---------|
| `package.json` | Dependencias Capacitor 6 + plugins |
| `capacitor.config.json` | Config app: ID, nombre, plugins |
| `js/push.js` | Lógica cliente: pide permiso, registra token, muestra toasts, navega |
| `sw.js` | Maneja push en background (Web PWA fallback) |
| `supabase/functions/send-push/index.ts` | Edge Function: autenticación admin + envío FCM |
| `supabase_push_tokens.sql` | Tablas: push_tokens, push_log con RLS |
| `admin.html` | Tab "Push" con formulario, preview y historial |
| `home.html` | initPush() se llama 1.5s después del login |
