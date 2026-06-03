import { Resend } from 'resend'
import { getPackById } from './pricing.js'

let resendClient

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  if (!resendClient) resendClient = new Resend(key)
  return resendClient
}

function fromAddress() {
  return process.env.RESEND_FROM || 'Iconify <onboarding@resend.dev>'
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendOrderConfirmationEmail({ to, packId, sessionId, appUrl, metadata = {} }) {
  if (!isResendConfigured()) {
    console.warn('RESEND_API_KEY not set — skipping order confirmation email')
    return null
  }

  const pack = getPackById(packId)
  if (!pack) throw new Error(`Unknown pack: ${packId}`)

  const studioUrl = `${appUrl}/?session_id=${encodeURIComponent(sessionId)}`
  const promptLine = metadata.prompt
    ? `<p style="margin:0 0 8px;color:#555;">Prompt: <em>${escapeHtml(metadata.prompt.slice(0, 120))}</em></p>`
    : ''

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <h1 style="font-size:22px;margin:0 0 12px;">Your Iconify order is confirmed</h1>
      <p style="margin:0 0 16px;color:#444;line-height:1.5;">
        Thanks for your purchase! Your <strong>${escapeHtml(pack.name)}</strong> pack
        (${pack.icons} icons) is ready in the studio.
      </p>
      ${promptLine}
      <p style="margin:0 0 20px;color:#444;line-height:1.5;">
        Open Iconify to generate and download your icon set. Sign in with Google if prompted — your pack unlocks automatically.
      </p>
      <a href="${studioUrl}" style="display:inline-block;background:#e63946;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;">
        Open Iconify Studio →
      </a>
      <p style="margin:24px 0 0;font-size:12px;color:#888;line-height:1.5;">
        Order total: $${pack.price} · Commercial license included<br/>
        Save this email — you can use the link above anytime on this device.
      </p>
    </div>
  `

  const resend = getResend()
  return resend.emails.send({
    from: fromAddress(),
    to,
    subject: `Iconify ${pack.name} pack — order confirmed`,
    html,
  })
}

export async function sendIconsDeliveryEmail({ to, packId, zipBuffer, filename, metadata = {} }) {
  const pack = getPackById(packId)
  const packName = pack?.name || 'Iconify'

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <h1 style="font-size:22px;margin:0 0 12px;">Your icons are attached</h1>
      <p style="margin:0 0 12px;color:#444;line-height:1.5;">
        Here is your ${escapeHtml(packName)} icon export${metadata.prompt ? ` for <em>${escapeHtml(metadata.prompt.slice(0, 80))}</em>` : ''}.
      </p>
      <p style="margin:0;color:#444;line-height:1.5;">
        The ZIP includes SVG files plus PNGs at 16, 32, 64, and 128px.
      </p>
    </div>
  `

  const resend = getResend()
  return resend.emails.send({
    from: fromAddress(),
    to,
    subject: `Your Iconify icon export (${packName})`,
    html,
    attachments: [
      {
        filename,
        content: zipBuffer,
      },
    ],
  })
}
