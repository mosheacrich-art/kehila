/**
 * Edge Function: send-push
 *
 * Envía notificaciones push FCM a todos los miembros activos (o a un subgrupo).
 * Solo accesible por admins autenticados.
 *
 * Requiere en Supabase Secrets:
 *   FIREBASE_SERVICE_ACCOUNT_JSON  ← JSON completo de la cuenta de servicio Firebase
 *   FIREBASE_PROJECT_ID            ← ID del proyecto Firebase (ej: jabad-barcelona-prod)
 *
 * Cómo obtenerlos:
 *   Firebase Console → Project Settings → Service Accounts → Generate new private key
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/* ── Google OAuth2: obtener access token desde service account ── */
async function getGoogleAccessToken(serviceAccount: Record<string, string>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const encoder = new TextEncoder()
  const b64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const sigInput = `${b64url(header)}.${b64url(payload)}`

  // Import RSA private key (PKCS8)
  const pemKey = serviceAccount.private_key.replace(/\\n/g, '\n')
  const keyDer = Uint8Array.from(atob(pemKey.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(sigInput))
  const b64sig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const jwt = `${sigInput}.${b64sig}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  return data.access_token as string
}

/* ── Enviar un mensaje FCM a un token ── */
async function sendFCM(accessToken: string, projectId: string, token: string, title: string, body: string, data: Record<string, string> = {}) {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        data,
        android: {
          priority: 'high',
          notification: { sound: 'default', channel_id: 'kehila_general' },
        },
        apns: {
          payload: {
            aps: { sound: 'default', badge: 1, 'content-available': 1 },
          },
        },
      },
    }),
  })
  return res.ok
}

/* ── Handler principal ── */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // 1. Verificar autenticación
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: CORS })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401, headers: CORS })

    // 2. Verificar que el usuario es admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Acceso denegado — solo admins' }), { status: 403, headers: CORS })
    }

    // 3. Parsear cuerpo de la petición
    const { title, body, tipo, subgrupo_id, id } = await req.json()
    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title y body son obligatorios' }), { status: 400, headers: CORS })
    }

    // 4. Obtener tokens de Supabase
    let tokensQuery = supabase
      .from('push_tokens')
      .select('token, platform, user_id')

    if (subgrupo_id) {
      // Notificación solo para un subgrupo
      const { data: miembros } = await supabase
        .from('subgrupo_miembros')
        .select('user_id')
        .eq('subgrupo_id', subgrupo_id)
      const userIds = (miembros || []).map((m: { user_id: string }) => m.user_id)
      if (!userIds.length) return new Response(JSON.stringify({ sent: 0, failed: 0 }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
      tokensQuery = tokensQuery.in('user_id', userIds)
    }

    const { data: tokens, error: tokensErr } = await tokensQuery
    if (tokensErr || !tokens?.length) {
      return new Response(JSON.stringify({ error: 'Sin tokens registrados', sent: 0 }), { status: 200, headers: CORS })
    }

    // 5. Obtener access token de Firebase
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON')!
    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')!
    const serviceAccount = JSON.parse(serviceAccountJson)
    const accessToken = await getGoogleAccessToken(serviceAccount)

    // 6. Enviar a todos los tokens (en paralelo, máx 500 por llamada)
    const pushData: Record<string, string> = { tipo: tipo || 'comunidad' }
    if (id) pushData.id = String(id)

    const results = await Promise.allSettled(
      tokens.map(({ token }: { token: string }) => sendFCM(accessToken, projectId, token, title, body, pushData))
    )

    const sent = results.filter(r => r.status === 'fulfilled' && r.value).length
    const failed = results.length - sent

    // 7. Registrar en push_log
    await supabase.from('push_log').insert({
      admin_id: user.id,
      title,
      body,
      tipo: tipo || 'comunidad',
      subgrupo_id: subgrupo_id || null,
      total_tokens: tokens.length,
      sent,
      failed,
    })

    return new Response(JSON.stringify({ sent, failed, total: tokens.length }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: CORS })
  }
})
