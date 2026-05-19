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

    // Si no actualizó ninguna fila (aún no hay stripe_customer_id), buscar por supabase_uid
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
    const customerId = sub.customer as string

    await supabase
      .from('negocios')
      .update({ stripe_subscription_status: 'canceled' })
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = invoice.customer as string

    await supabase
      .from('negocios')
      .update({ stripe_subscription_status: 'past_due' })
      .eq('stripe_customer_id', customerId)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
