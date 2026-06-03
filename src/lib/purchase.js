const PURCHASE_KEY = 'iconify-purchase'
const PENDING_ORDER_KEY = 'iconify-pending-order'
const EMAIL_SENT_KEY = 'iconify-email-sent'

export function readPurchase() {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writePurchase(purchase) {
  try {
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase))
  } catch {
    /* ignore */
  }
}

export function clearPurchase() {
  try {
    localStorage.removeItem(PURCHASE_KEY)
  } catch {
    /* ignore */
  }
}

export function readPendingOrder() {
  try {
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writePendingOrder(order) {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order))
  } catch {
    /* ignore */
  }
}

export function clearPendingOrder() {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY)
  } catch {
    /* ignore */
  }
}

export function hasEmailedForSession(sessionId) {
  try {
    return sessionStorage.getItem(`${EMAIL_SENT_KEY}:${sessionId}`) === '1'
  } catch {
    return false
  }
}

export function markEmailedForSession(sessionId) {
  try {
    sessionStorage.setItem(`${EMAIL_SENT_KEY}:${sessionId}`, '1')
  } catch {
    /* ignore */
  }
}

/** @deprecated use readPurchase().packId */
export function readLegacyUnlock() {
  try {
    return sessionStorage.getItem('iconify-unlock') || null
  } catch {
    return null
  }
}
