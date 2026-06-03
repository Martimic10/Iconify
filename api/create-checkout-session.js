import { getStripe, getAppUrl } from './_lib/stripe.js'
import { getPackById } from './_lib/pricing.js'
import { badRequest, json, methodNotAllowed, readJsonBody, serverError, setCors } from './_lib/http.js'

export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') return methodNotAllowed(res)

  try {
    const body = await readJsonBody(req)
    const { packId, email, orderContext = {} } = body

    if (!packId || !getPackById(packId)) {
      return badRequest(res, 'Invalid pack')
    }

    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return badRequest(res, 'Valid email is required')
    }

    const pack = getPackById(packId)
    const appUrl = process.env.APP_URL || getAppUrl()
    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: normalizedEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: pack.price * 100,
            product_data: {
              name: `Iconify ${pack.name} Pack`,
              description: `${pack.icons} custom AI-generated icons · SVG + PNG · Commercial license`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        packId: pack.id,
        iconCount: String(pack.icons),
        prompt: String(orderContext.prompt || '').slice(0, 500),
        style: String(orderContext.style || ''),
        color: String(orderContext.color || ''),
        count: String(orderContext.count || pack.icons),
      },
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
    })

    json(res, 200, { url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('create-checkout-session:', err)
    const message = err.message || 'Failed to create checkout session'
    if (message.includes('STRIPE_SECRET_KEY')) {
      serverError(res, 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.')
      return
    }
    serverError(res, message)
  }
}
