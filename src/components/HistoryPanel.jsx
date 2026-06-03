import { Trash2, Clock, Sparkles, Loader2 } from 'lucide-react'
import { formatGenerationDate } from '../lib/generations'

export default function HistoryPanel({
  items,
  loading,
  onLoad,
  onDelete,
  styleNameFor,
  colorNameFor,
}) {
  if (loading) {
    return (
      <div className="history-panel history-panel--empty">
        <Loader2 size={28} className="app-spin" />
        <p>Loading your generations…</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="history-panel history-panel--empty">
        <Sparkles size={32} strokeWidth={1.5} />
        <h2>No saved generations yet</h2>
        <p>Generate an icon set in Create — it&apos;ll show up here automatically.</p>
      </div>
    )
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2 className="history-title">Your generations</h2>
        <p className="history-sub">{items.length} saved {items.length === 1 ? 'set' : 'sets'}</p>
      </div>
      <div className="history-list">
        {items.map((item) => (
          <article key={item.id} className="history-card">
            <div className="history-card-main">
              <div
                className="history-swatch"
                style={{ background: item.color || '#e63946' }}
                aria-hidden
              />
              <div className="history-card-body">
                <h3 className="history-prompt">
                  {item.prompt?.length > 80 ? `${item.prompt.slice(0, 80)}…` : item.prompt}
                </h3>
                <div className="history-meta">
                  <span>{item.count} icons</span>
                  <span>·</span>
                  <span>{styleNameFor(item.style)}</span>
                  <span>·</span>
                  <span>{colorNameFor(item.color)}</span>
                </div>
                <div className="history-date">
                  <Clock size={12} />
                  {formatGenerationDate(item.createdAt)}
                </div>
              </div>
            </div>
            <div className="history-card-actions">
              <button type="button" className="history-load-btn" onClick={() => onLoad(item)}>
                Open
              </button>
              <button
                type="button"
                className="history-delete-btn"
                onClick={() => onDelete(item.id)}
                title="Delete"
                aria-label="Delete generation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
