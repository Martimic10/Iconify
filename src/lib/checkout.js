const API_BASE = import.meta.env.VITE_API_BASE || ''

export const USE_MOCK_CHECKOUT = import.meta.env.VITE_USE_MOCK_CHECKOUT === 'true'

async function parseError(res) {
  try {
    const data = await res.json()
    return data.error || res.statusText
  } catch {
    return res.statusText || 'Request failed'
  }
}

/**
 * @param {{ packId: string, email: string, orderContext?: object }} params
 */
export async function createCheckoutSession({ packId, email, orderContext = {} }) {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packId, email, orderContext }),
  })

  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/**
 * @param {string} sessionId
 */
export async function verifyCheckoutSession(sessionId) {
  const res = await fetch(
    `${API_BASE}/api/verify-session?session_id=${encodeURIComponent(sessionId)}`,
  )

  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/**
 * @param {{ sessionId: string, zipBase64: string, filename?: string }} params
 */
export async function sendIconsEmail({ sessionId, zipBase64, filename }) {
  const res = await fetch(`${API_BASE}/api/send-icons-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, zipBase64, filename }),
  })

  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to encode file'))
        return
      }
      resolve(result.split(',')[1] || '')
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
