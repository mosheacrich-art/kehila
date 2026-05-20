import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, webhookSecret)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error'
    return new Response(JSON.stringify({ error: msg }), { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Donativos únicos
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const meta = pi.metadata || {}
    const uid = meta.supabase_uid
    const campana_nombre = meta.campana_nombre || 'Donativo'
    const cantidad = parseFloat(meta.cantidad || '0') || pi.amount / 100
    const dedicatoria = meta.dedicatoria || null

    if (uid) {
      await supabase.from('donaciones').upsert({
        stripe_payment_intent_id: pi.id,
        usuario_id: uid,
        usuario_nombre: 'Socio',
        campana_nombre,
        campana_id: null,
        cantidad,
        recurrente: false,
        dedicatoria,
      }, { onConflict: 'stripe_payment_intent_id', ignoreDuplicates: true })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    // Solo logging — el frontend ya muestra el error al usuario
  }

  // Suscripciones de negocios (funcionalidad existente)
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string
    const status = sub.status
    const currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString()
    const priceId = sub.items.data[0]?.price.id ?? null

    await supabase
      .from('negocios')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        stripe_subscription_status: status,
        stripe_current_period_end: currentPeriodEnd,
        stripe_price_id: priceId,
      })
      .eq('stripe_customer_id', customerId)

    const uid = sub.metadata?.supabase_uid
    if (uid) {
      await supabase
        .from('negocios')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          stripe_subscription_status: status,
          stripe_current_period_end: currentPeriodEnd,
          stripe_price_id: priceId,
        })
        .eq('usuario_id', uid)
        .is('stripe_customer_id', null)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('negocios')
      .update({ stripe_subscription_status: 'canceled' })
      .eq('stripe_customer_id', sub.customer as string)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    await supabase
      .from('negocios')
      .update({ stripe_subscription_status: 'past_due' })
      .eq('stripe_customer_id', invoice.customer as string)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
