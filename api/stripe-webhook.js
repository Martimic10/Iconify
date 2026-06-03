import { getStripe, isSessionPaid, packFromSession, getAppUrl } from './_lib/stripe.js'
import { sendOrderConfirmationEmail } from './_lib/email.js'
import { readRawBody, json, methodNotAllowed, serverError } from './_lib/http.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    serverError(res, 'STRIPE_WEBHOOK_SECRET is not configured')
    return
  }

  try {
    const stripe = getStripe()
    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      json(res, 400, { error: 'Invalid signature' })
      return
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      if (!isSessionPaid(session)) {
        json(res, 200, { received: true, skipped: 'unpaid' })
        return
      }

      const order = packFromSession(session)
      const email = session.customer_details?.email || session.customer_email
      const appUrl = process.env.APP_URL || getAppUrl()

      if (email && order?.packId) {
        try {
          await sendOrderConfirmationEmail({
            to: email,
            packId: order.packId,
            sessionId: session.id,
            appUrl,
            metadata: {
              prompt: order.prompt,
              style: order.style,
              color: order.color,
            },
          })
        } catch (emailErr) {
          console.error('Order confirmation email failed:', emailErr)
        }
      }
    }

    json(res, 200, { received: true })
  } catch (err) {
    console.error('stripe-webhook:', err)
    serverError(res, err.message || 'Webhook handler failed')
  }
}
