import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { PACKS, getPackById, FREE_ICON_LIMIT } from '../lib/pricing'
import { createCheckoutSession, USE_MOCK_CHECKOUT } from '../lib/checkout'
import { writePendingOrder } from '../lib/purchase'
import { useAuth } from '../contexts/AuthContext'

export default function CheckoutModal({
  packId,
  iconCount,
  orderContext = {},
  onClose,
  onSwitch,
  onPaid,
}) {
  const { user } = useAuth()
  const pack = getPackById(packId)
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user?.email])

  if (!pack) return null

  const handlePay = async () => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')

    if (USE_MOCK_CHECKOUT) {
      onPaid?.(pack.id)
      onClose()
      return
    }

    setLoading(true)
    try {
      writePendingOrder({
        packId: pack.id,
        iconCount,
        ...orderContext,
      })

      const { url } = await createCheckoutSession({
        packId: pack.id,
        email: normalizedEmail,
        orderContext: {
          ...orderContext,
          count: orderContext.count || iconCount || pack.icons,
        },
      })

      window.location.href = url
    } catch (err) {
      setError(err.message || 'Could not start checkout. Try again.')
      setLoading(false)
    }
  }

  return createPortal(
    <div className="modal-overlay checkout-modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal checkout-modal">
        <div className="modal-drag-handle" aria-hidden />
        <button type="button" className="modal-close" onClick={onClose} disabled={loading}>✕</button>
        <div className="modal-title">Upgrade to generate {iconCount} icons</div>
        <p className="modal-sub">
          Free includes {FREE_ICON_LIMIT} icons. Pay once via Stripe — we&apos;ll email your receipt and a link back to the studio.
        </p>
        <div className="pack-switcher">
          {PACKS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pack-btn${p.id === packId ? ' active' : ''}`}
              onClick={() => onSwitch(p.id)}
              disabled={loading}
            >
              {p.name} · ${p.price}
            </button>
          ))}
        </div>
        <div className="checkout-summary">
          <span>{pack.name} pack</span>
          <span>{pack.icons} icons · ${pack.price}</span>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="checkout-email">Email address</label>
          <input
            id="checkout-email"
            className="form-input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />
        </div>
        {error && <p className="checkout-error">{error}</p>}
        <button type="button" className="pay-btn" onClick={handlePay} disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="app-spin" /> Redirecting to Stripe…</>
          ) : (
            <>Continue to Stripe · ${pack.price} →</>
          )}
        </button>
        <p className="stripe-note">Secured by Stripe · One-time payment · No subscription</p>
      </div>
    </div>,
    document.body,
  )
}
