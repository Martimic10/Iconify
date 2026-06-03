import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'
import { PACKS, FREE_ICON_LIMIT, getPackById } from '../lib/pricing'

export default function PricingModal({ targetCount, suggestedPackId, onClose, onSelectPack }) {
  const suggested = suggestedPackId || (targetCount ? getSuggestedPack(targetCount) : 'pro')

  return createPortal(
    <div className="modal-overlay pricing-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal pricing-modal" role="dialog" aria-labelledby="pricing-modal-title">
        <div className="modal-drag-handle" aria-hidden />
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        <div className="pricing-modal-header">
          <span className="tag">Upgrade</span>
          <h2 id="pricing-modal-title" className="pricing-modal-title">
            {targetCount ? `Unlock ${targetCount} icons` : 'Choose a pack'}
          </h2>
          <p className="pricing-modal-sub">
            Free includes {FREE_ICON_LIMIT} icons. Pick a one-time pack — no subscription.
          </p>
        </div>
        <div className="pricing-modal-grid">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`pricing-card pricing-card--modal${pack.popular ? ' pricing-card-popular' : ''}${pack.id === suggested ? ' pricing-card-suggested' : ''}`}
            >
              <div className="pricing-card-header">
                <span className="pricing-pack-name">{pack.name}</span>
                {pack.popular && <span className="pricing-popular-label">Most Popular</span>}
                {pack.id === suggested && targetCount && (
                  <span className="pricing-suggested-label">Best for {targetCount}</span>
                )}
              </div>
              <div className="pricing-price-row">
                <span className="pricing-dollar">$</span>
                <span className="pricing-amount">{pack.price}</span>
              </div>
              <div className="pricing-per">{pack.perIcon} · {pack.icons} icons</div>
              <button
                type="button"
                className={`pricing-cta ${pack.popular ? 'pricing-cta-primary' : 'pricing-cta-ghost'}`}
                onClick={() => onSelectPack(pack.id)}
              >
                Get {pack.name} →
              </button>
              <hr className="pricing-divider" />
              <div className="pricing-audience">{pack.audience}</div>
              <ul className="pricing-features">
                {pack.features.slice(0, 4).map((f) => (
                  <li key={f} className="pricing-feature-item">
                    <div className="pricing-feat-check">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function getSuggestedPack(count) {
  const pack = getPackById(
    count <= 12 ? 'starter' : count <= 36 ? 'pro' : 'studio',
  )
  return pack?.id || 'pro'
}
