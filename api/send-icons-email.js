import { getStripe, isSessionPaid, packFromSession } from './_lib/stripe.js'
import { isResendConfigured, sendIconsDeliveryEmail } from './_lib/email.js'
import { badRequest, json, methodNotAllowed, readJsonBody, serverError, setCors } from './_lib/http.js'

const MAX_ZIP_BYTES = 15 * 1024 * 1024

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
    const { sessionId, zipBase64, filename = 'iconify-icons.zip' } = body

    if (!sessionId) return badRequest(res, 'sessionId is required')
    if (!zipBase64) return badRequest(res, 'zipBase64 is required')

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!isSessionPaid(session)) return badRequest(res, 'Payment not verified')

    const email = session.customer_details?.email || session.customer_email
    if (!email) return badRequest(res, 'No email on checkout session')

    const order = packFromSession(session)
    const zipBuffer = Buffer.from(zipBase64, 'base64')
    if (zipBuffer.length > MAX_ZIP_BYTES) {
      return badRequest(res, 'Export file is too large to email')
    }

    if (!isResendConfigured()) {
      json(res, 503, { error: 'Email delivery is not configured' })
      return
    }

    await sendIconsDeliveryEmail({
      to: email,
      packId: order?.packId,
      zipBuffer,
      filename,
      metadata: {
        prompt: order?.prompt,
        style: order?.style,
        color: order?.color,
      },
    })

    json(res, 200, { sent: true })
  } catch (err) {
    console.error('send-icons-email:', err)
    serverError(res, err.message || 'Failed to send icons email')
  }
}
