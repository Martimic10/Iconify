import Stripe from 'stripe'

let stripeClient

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  if (!stripeClient) stripeClient = new Stripe(key)
  return stripeClient
}

export function getAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export function packFromSession(session) {
  const packId = session.metadata?.packId
  if (!packId) return null
  return {
    packId,
    iconCount: Number(session.metadata?.iconCount || session.metadata?.count || 0),
    prompt: session.metadata?.prompt || '',
    style: session.metadata?.style || '',
    color: session.metadata?.color || '',
    count: Number(session.metadata?.count || session.metadata?.iconCount || 0),
  }
}

export function isSessionPaid(session) {
  return session.payment_status === 'paid' && session.status === 'complete'
}
