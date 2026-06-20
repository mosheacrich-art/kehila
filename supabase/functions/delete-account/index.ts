import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: corsHeaders });

    // Client with user's JWT to verify identity
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: 'Sesión inválida' }), { status: 401, headers: corsHeaders });

    const userId = user.id;

    // Admin client with service role to delete data
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete user data from all tables
    await adminClient.from('mikve_reservas').delete().eq('usuario_id', userId);
    await adminClient.from('donaciones').delete().eq('usuario_id', userId);
    await adminClient.from('inscripciones').delete().eq('usuario_id', userId);
    await adminClient.from('inscripciones_voluntariado').delete().eq('usuario_id', userId);
    await adminClient.from('preguntas_rav').delete().eq('usuario_id', userId);
    await adminClient.from('citas').delete().eq('usuario_id', userId);
    await adminClient.from('anuncios').delete().eq('usuario_id', userId);
    await adminClient.from('wallap_anuncios').delete().eq('usuario_id', userId);
    await adminClient.from('negocios').delete().eq('usuario_id', userId);
    await adminClient.from('subgrupo_miembros').delete().eq('usuario_id', userId);
    await adminClient.from('profiles').delete().eq('id', userId);

    // Delete auth user (permanently removes login)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
