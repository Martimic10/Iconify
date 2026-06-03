import { getStripe, isSessionPaid, packFromSession } from './_lib/stripe.js'
import { getPackById } from './_lib/pricing.js'
import { badRequest, json, methodNotAllowed, serverError, setCors } from './_lib/http.js'

export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'GET') return methodNotAllowed(res)

  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const sessionId = url.searchParams.get('session_id')
    if (!sessionId) return badRequest(res, 'session_id is required')

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!isSessionPaid(session)) {
      json(res, 200, { paid: false })
      return
    }

    const order = packFromSession(session)
    const pack = getPackById(order?.packId)
    if (!pack) return badRequest(res, 'Invalid order metadata')

    json(res, 200, {
      paid: true,
      sessionId: session.id,
      packId: pack.id,
      iconCount: pack.icons,
      email: session.customer_details?.email || session.customer_email || null,
      order: {
        prompt: order.prompt,
        style: order.style,
        color: order.color,
        count: order.count || pack.icons,
      },
    })
  } catch (err) {
    console.error('verify-session:', err)
    serverError(res, err.message || 'Failed to verify session')
  }
}
