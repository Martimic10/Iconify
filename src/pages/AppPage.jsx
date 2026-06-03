import { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react'
import CheckoutModal from '../components/CheckoutModal'
import PricingModal from '../components/PricingModal'
import { useAuth } from '../contexts/AuthContext'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { generateIconsFromPrompt } from '../lib/generateIconsAsync'
import { generateIconsFromCatalog } from '../lib/generateIcons'
import NounIcon from '../components/NounIcon'
import { isNounIcon } from '../lib/nounSvg'
import { saveGeneration, subscribeGenerations, deleteGeneration } from '../lib/generations'
import { downloadIconSvg, buildIconSetZip } from '../lib/exportIcons'
import {
  verifyCheckoutSession,
  sendIconsEmail,
  blobToBase64,
  USE_MOCK_CHECKOUT,
} from '../lib/checkout'
import {
  readPurchase,
  writePurchase,
  clearPurchase,
  readPendingOrder,
  clearPendingOrder,
  hasEmailedForSession,
  markEmailedForSession,
  readLegacyUnlock,
} from '../lib/purchase'
import {
  ICON_COUNTS,
  FREE_ICON_LIMIT,
  getPackForCount,
  getPackById,
  maxIconsUnlocked,
  needsUpgrade,
} from '../lib/pricing'
import {
  Square, Layers, Box, Grid2x2, Pencil, Circle, Hexagon, Sparkles,
  GlassWater, Minus, Zap as ZapIcon, Lock,
  Home, Settings, Search, User, Bell, Heart, BarChart2, Folder,
  Zap, CreditCard, Wallet, Landmark, TrendingUp, Smartphone,
  CheckCircle, ArrowLeftRight, Coins, Banknote, TrendingDown,
  Receipt, Target, Globe, Link, FileText, Send, Shield, Gift,
  Phone, Key, MessageCircle, Camera, Star, Tag, Music, Video,
  Users, Calendar, MapPin, Moon, Lightbulb, RefreshCw, Save,
  Download, Trash2, Edit3, Share2, Rocket, LayoutDashboard,
  Clipboard, Archive, Pin, Loader2, LogOut, History,
  Mail, Package, Code, Database,
} from 'lucide-react'

const HistoryPanel = lazy(() => import('../components/HistoryPanel'))

const STYLES = [
  { id: 'outline', Icon: Square, name: 'Outline', desc: 'Clean strokes' },
  { id: 'flat', Icon: Square, name: 'Flat', desc: 'Solid fills' },
  { id: 'duotone', Icon: Layers, name: 'Duotone', desc: 'Two-tone depth' },
  { id: 'bold', Icon: Hexagon, name: 'Bold', desc: 'Heavy weight' },
  { id: 'rounded', Icon: Circle, name: 'Rounded', desc: 'Soft corners' },
  { id: '3d', Icon: Box, name: '3D', desc: 'Dimensional' },
  { id: 'glass', Icon: GlassWater, name: 'Glass', desc: 'Frosted UI' },
  { id: 'gradient', Icon: Sparkles, name: 'Gradient', desc: 'Color blend' },
  { id: 'neon', Icon: ZapIcon, name: 'Neon', desc: 'Glowing edges' },
  { id: 'pixel', Icon: Grid2x2, name: 'Pixel', desc: 'Retro grid' },
  { id: 'sketchy', Icon: Pencil, name: 'Sketchy', desc: 'Hand-drawn' },
  { id: 'minimal', Icon: Minus, name: 'Minimal', desc: 'Ultra light' },
]

const COLORS = [
  { name: 'Crimson', value: '#e63946' },
  { name: 'Scarlet', value: '#ef4444' },
  { name: 'Rose', value: '#e91e8c' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blush', value: '#f472b6' },
  { name: 'Coral', value: '#ff6b6b' },
  { name: 'Peach', value: '#fb923c' },
  { name: 'Tangerine', value: '#ea580c' },
  { name: 'Amber', value: '#f4a261' },
  { name: 'Gold', value: '#e9c46a' },
  { name: 'Honey', value: '#ca8a04' },
  { name: 'Lemon', value: '#eab308' },
  { name: 'Olive', value: '#65a30d' },
  { name: 'Forest', value: '#2d6a4f' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Jade', value: '#059669' },
  { name: 'Mint', value: '#2dd4bf' },
  { name: 'Aqua', value: '#06b6d4' },
  { name: 'Teal', value: '#00b4d8' },
  { name: 'Ocean', value: '#0077b6' },
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Azure', value: '#3b82f6' },
  { name: 'Cobalt', value: '#1d4ed8' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Royal', value: '#6d28d9' },
  { name: 'Violet', value: '#7b2d8b' },
  { name: 'Grape', value: '#7c3aed' },
  { name: 'Berry', value: '#a855f7' },
  { name: 'Lavender', value: '#a78bfa' },
  { name: 'Magenta', value: '#c026d3' },
  { name: 'Copper', value: '#c2410c' },
  { name: 'Espresso', value: '#78350f' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Steel', value: '#475569' },
  { name: 'Midnight', value: '#1e293b' },
  { name: 'Onyx', value: '#0f172a' },
]

const UNLOCK_STORAGE_KEY = 'iconify-unlock'

function readInitialUnlock() {
  const purchase = readPurchase()
  if (purchase?.packId) return purchase.packId
  try {
    return sessionStorage.getItem(UNLOCK_STORAGE_KEY) || readLegacyUnlock() || null
  } catch {
    return readLegacyUnlock()
  }
}

function writeLegacyUnlock(packId) {
  try {
    sessionStorage.setItem(UNLOCK_STORAGE_KEY, packId)
  } catch {
    /* ignore */
  }
}

const PREVIEW_ICONS = [
  { name: 'home', Icon: Home },
  { name: 'search', Icon: Search },
  { name: 'calendar', Icon: Calendar },
  { name: 'star', Icon: Star },
]

const PROMPT_PLACEHOLDERS = [
  'A fintech app for Gen Z savers…',
  'A project management tool for remote teams…',
  'A social platform for indie musicians…',
  'A wellness app for mindful morning routines…',
  'An AI copilot for ecommerce founders…',
]

/* 5×5 pixel smile for style preview */
const PIXEL_PREVIEW = [
  [0, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
]

function shadeHex(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount))
  const b = Math.max(0, Math.min(255, (n & 255) + amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function Preview3D({ active }) {
  const top = active ? 'var(--app-brand)' : 'currentColor'
  const left = active ? 'color-mix(in srgb, var(--app-brand) 55%, #000)' : 'color-mix(in srgb, currentColor 50%, #000)'
  const right = active ? 'color-mix(in srgb, var(--app-brand) 75%, #fff)' : 'color-mix(in srgb, currentColor 70%, #fff)'
  return (
    <svg className="preview-3d" viewBox="0 0 28 28" width="26" height="26" aria-hidden>
      <polygon points="14,5 23,10 14,15 5,10" fill={right} />
      <polygon points="5,10 14,15 14,23 5,18" fill={left} />
      <polygon points="14,15 23,10 23,18 14,23" fill={top} />
    </svg>
  )
}

function PreviewPixel({ active }) {
  return (
    <span className={`preview-pixel${active ? ' preview-pixel--active' : ''}`} aria-hidden>
      {PIXEL_PREVIEW.map((row, y) =>
        row.map((on, x) => (
          <span key={`${x}-${y}`} className={on ? 'preview-pixel-cell on' : 'preview-pixel-cell'} />
        ))
      )}
    </span>
  )
}

function StylePreview({ styleId, Icon, active }) {
  const iconProps = { size: 18, strokeWidth: 1.5 }

  if (styleId === '3d') return <Preview3D active={active} />
  if (styleId === 'pixel') return <PreviewPixel active={active} />

  if (styleId === 'flat') {
    return <Icon size={18} strokeWidth={0} fill="currentColor" />
  }
  if (styleId === 'bold') {
    return <Icon size={18} strokeWidth={2.75} />
  }
  if (styleId === 'minimal') {
    return <Icon size={18} strokeWidth={1} />
  }
  if (styleId === 'sketchy') {
    return <Icon size={18} strokeWidth={2.5} className="preview-sketchy" />
  }
  if (styleId === 'duotone') {
    return <Icon size={18} strokeWidth={1.5} fill="currentColor" fillOpacity={0.35} />
  }
  if (styleId === 'neon') {
    return <Icon size={18} strokeWidth={1.5} className="preview-neon" />
  }
  if (styleId === 'gradient') {
    return <Icon size={18} strokeWidth={1.5} className="preview-gradient" />
  }
  if (styleId === 'glass') {
    return (
      <span className="preview-glass">
        <Icon {...iconProps} />
      </span>
    )
  }
  if (styleId === 'rounded') {
    return <Icon size={18} strokeWidth={1.5} className="preview-rounded" />
  }

  return <Icon {...iconProps} />
}

function StyledIcon({ icon, Icon, styleId, color, size = 36 }) {
  if (icon && isNounIcon(icon)) {
    if (styleId === '3d') {
      return (
        <div className="icon-3d-extrude" style={{ '--icon-color': color }}>
          <NounIcon svg={icon.svg} color={shadeHex(color, -70)} size={size * 0.7} styleId={styleId} className="icon-3d-layer icon-3d-back" />
          <NounIcon svg={icon.svg} color={shadeHex(color, -35)} size={size * 0.75} styleId={styleId} className="icon-3d-layer icon-3d-mid" />
          <NounIcon svg={icon.svg} color={color} size={size * 0.8} styleId={styleId} className="icon-3d-layer icon-3d-front" />
        </div>
      )
    }
    if (styleId === 'pixel') {
      return (
        <div className="icon-pixel-frame" style={{ '--icon-color': color }}>
          <div className="icon-pixel-inner">
            <NounIcon svg={icon.svg} color={color} size={20} styleId={styleId} />
          </div>
        </div>
      )
    }
    return (
      <NounIcon
        svg={icon.svg}
        color={color}
        size={size}
        styleId={styleId}
        className={`icon-card-icon--${styleId}`}
      />
    )
  }

  if (!Icon) return null

  if (styleId === '3d') {
    return (
      <div className="icon-3d-extrude" style={{ '--icon-color': color }}>
        <Icon size={36} strokeWidth={1.5} className="icon-3d-layer icon-3d-back" style={{ color: shadeHex(color, -70) }} />
        <Icon size={36} strokeWidth={1.5} className="icon-3d-layer icon-3d-mid" style={{ color: shadeHex(color, -35) }} />
        <Icon size={36} strokeWidth={1.5} className="icon-3d-layer icon-3d-front" style={{ color }} />
      </div>
    )
  }

  if (styleId === 'pixel') {
    return (
      <div className="icon-pixel-frame" style={{ '--icon-color': color }}>
        <div className="icon-pixel-inner">
          <Icon size={20} strokeWidth={2.25} color={color} />
        </div>
      </div>
    )
  }

  const props = getIconProps(styleId, color)
  return <Icon {...props} />
}

function IconGradientDefs({ from, to }) {
  return (
    <svg aria-hidden="true" width="0" height="0" className="icon-gradient-defs">
      <defs>
        <linearGradient id="iconify-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CanvasStylePreview({ icons, styleId, color, styleName, colorName }) {
  return (
    <div className="canvas-preview">
      <div className="canvas-preview-grid">
        {icons.map((icon) => (
          <div key={icon.name} className="canvas-preview-item">
            <div className={`icon-card-icon icon-card-icon--${styleId}`}>
              <StyledIcon icon={icon} Icon={icon.Icon} styleId={styleId} color={color} size={28} />
            </div>
          </div>
        ))}
      </div>
      <p className="canvas-preview-meta">{styleName} · {colorName}</p>
    </div>
  )
}

const MemoCanvasStylePreview = memo(CanvasStylePreview)

const IconCard = memo(function IconCard({ icon, styleId, color, onDownload }) {
  return (
    <div
      className={`icon-card icon-card--${styleId}`}
      style={{ '--card-accent': color }}
    >
      <button type="button" className="icon-dl" title="Download SVG" onClick={onDownload}>
        <Download size={11} />
      </button>
      <div className={`icon-card-icon icon-card-icon--${styleId}`}>
        <StyledIcon icon={icon} Icon={icon.Icon} styleId={styleId} color={color} />
      </div>
      <div className="icon-card-name">{icon.name}</div>
      <div className="icon-card-accent" />
    </div>
  )
})

function getIconProps(styleId, color) {
  const base = { size: 36 }
  switch (styleId) {
    case 'flat':
      return { ...base, strokeWidth: 0, fill: color, color }
    case 'bold':
      return { ...base, strokeWidth: 2.75, color }
    case 'minimal':
      return { ...base, strokeWidth: 1, color: 'var(--text-muted)' }
    case 'sketchy':
      return { ...base, strokeWidth: 2.5, color }
    case 'duotone':
      return { ...base, strokeWidth: 1.5, color, fill: `${color}33` }
    default:
      return { ...base, strokeWidth: 1.5, color: styleId === 'neon' || styleId === 'gradient' ? color : 'var(--text-muted)' }
  }
}

export default function AppPage({ onGoBack, onSignOut }) {
  const { user } = useAuth()
  const [studioTab, setStudioTab] = useState('create')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('outline')
  const [color, setColor] = useState('#e63946')
  const [count, setCount] = useState(FREE_ICON_LIMIT)
  const [state, setState] = useState('empty')
  const [icons, setIcons] = useState([])
  const [genMsg, setGenMsg] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [genVariant, setGenVariant] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [unlockedPackId, setUnlockedPackId] = useState(readInitialUnlock)
  const [stripeSessionId, setStripeSessionId] = useState(() => readPurchase()?.sessionId || null)
  const [checkoutModal, setCheckoutModal] = useState(null)
  const [pricingModal, setPricingModal] = useState(null)
  const [checkoutNotice, setCheckoutNotice] = useState('')
  const [mobilePanel, setMobilePanel] = useState('controls')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const unlockedMax = maxIconsUnlocked(unlockedPackId)

  useEffect(() => {
    if (!user?.uid) {
      setHistory([])
      setHistoryLoading(false)
      return undefined
    }
    setHistoryLoading(true)
    return subscribeGenerations(user.uid, (items) => {
      setHistory(items)
      setHistoryLoading(false)
    })
  }, [user?.uid])

  useEffect(() => {
    if (studioTab === 'create') setMobilePanel('controls')
  }, [studioTab])

  const applyVerifiedPurchase = (result) => {
    setUnlockedPackId(result.packId)
    setStripeSessionId(result.sessionId)
    writePurchase({ packId: result.packId, sessionId: result.sessionId })
    writeLegacyUnlock(result.packId)

    if (result.order?.prompt) setPrompt(result.order.prompt)
    if (result.order?.style) setStyle(result.order.style)
    if (result.order?.color) setColor(result.order.color)
    if (result.order?.count) setCount(result.order.count)
  }

  const runGenerate = async (regenerate = false, promptOverride, countOverride) => {
    const text = (promptOverride ?? prompt).trim()
    if (!text) return
    const iconCount = countOverride ?? count
    const variant = regenerate ? genVariant + 1 : 0
    if (regenerate) setGenVariant(variant)
    else setGenVariant(0)

    setState('generating')
    setGenMsg(`Finding ${iconCount} icons for "${text.slice(0, 40)}${text.length > 40 ? '…' : ''}"`)
    if (isMobile) setMobilePanel('preview')

    try {
      const generated = await generateIconsFromPrompt(text, iconCount, variant, style)
      setIcons(generated)
      setState('done')
      if (isMobile) setMobilePanel('preview')

      if (user?.uid) {
        saveGeneration(user.uid, {
          prompt: text,
          style,
          color,
          count: iconCount,
          variant,
          iconNames: generated.map((item) => item.name),
          nounIds: generated.filter((item) => item.nounId).map((item) => item.nounId),
          source: generated.some((item) => item.nounId) ? 'noun' : 'lucide',
        }).catch(() => {})
      }
    } catch (err) {
      setGenMsg(err.message || 'Generation failed')
      setState('empty')
    }
  }

  const loadGeneration = async (gen) => {
    const variant = gen.variant ?? 0
    setPrompt(gen.prompt)
    setStyle(gen.style)
    setColor(gen.color)
    setCount(gen.count)
    setGenVariant(variant)
    setStudioTab('create')
    setState('generating')
    setGenMsg('Loading your saved set…')
    if (isMobile) setMobilePanel('preview')

    try {
      const restored = await generateIconsFromPrompt(
        gen.prompt,
        gen.count,
        variant,
        gen.style,
        gen.nounIds || [],
      )
      setIcons(restored)
      setState('done')
      if (isMobile) setMobilePanel('preview')
    } catch {
      setState('empty')
    }
  }

  const handleDeleteGeneration = async (id) => {
    if (!user?.uid) return
    await deleteGeneration(user.uid, id)
  }

  const styleNameFor = (styleId) => STYLES.find((s) => s.id === styleId)?.name || styleId
  const colorNameFor = (colorValue) => COLORS.find((c) => c.value === colorValue)?.name || colorValue

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('checkout') === 'cancelled') {
      setCheckoutNotice('Checkout cancelled — no charge was made.')
      window.history.replaceState({}, '', window.location.pathname)
      return undefined
    }

    const sessionId = params.get('session_id')
    if (sessionId && !USE_MOCK_CHECKOUT) {
      let cancelled = false
      setCheckoutNotice('Verifying your payment…')

      verifyCheckoutSession(sessionId)
        .then((result) => {
          if (cancelled) return
          window.history.replaceState({}, '', window.location.pathname)

          if (!result.paid) {
            setCheckoutNotice('Payment was not completed.')
            return
          }

          applyVerifiedPurchase(result)
          const pending = readPendingOrder()
          clearPendingOrder()
          setCheckoutNotice('Payment confirmed — your pack is unlocked.')

          if (pending?.pendingAction === 'generate') {
            const text = result.order?.prompt || pending.prompt || ''
            const iconCount = result.order?.count || pending.count || result.iconCount
            if (text.trim()) {
              setPrompt(text)
              if (iconCount) setCount(iconCount)
              runGenerate(false, text, iconCount)
            }
          }
        })
        .catch((err) => {
          if (!cancelled) setCheckoutNotice(err.message || 'Could not verify payment.')
        })

      return () => { cancelled = true }
    }

    const purchase = readPurchase()
    if (purchase?.sessionId && !USE_MOCK_CHECKOUT) {
      verifyCheckoutSession(purchase.sessionId)
        .then((result) => {
          if (result.paid) {
            setUnlockedPackId(result.packId)
            setStripeSessionId(result.sessionId)
          } else {
            clearPurchase()
            setUnlockedPackId(null)
            setStripeSessionId(null)
          }
        })
        .catch(() => {})
    }

    return undefined
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (prompt.trim()) return undefined
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PROMPT_PLACEHOLDERS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [prompt])

  const openPricingForCount = (targetCount, pendingAction) => {
    setPricingModal({
      targetCount,
      suggestedPackId: getPackForCount(targetCount),
      pendingAction,
    })
  }

  const handleSelectPack = (packId) => {
    const pending = pricingModal
    const pack = getPackById(packId)
    setPricingModal(null)
    setCheckoutModal({
      packId,
      iconCount: pending?.targetCount ?? pack?.icons,
      pendingAction: pending?.pendingAction,
      orderContext: {
        prompt,
        style,
        color,
        count: pending?.targetCount ?? pack?.icons,
        pendingAction: pending?.pendingAction,
      },
    })
  }

  const requestUpgrade = (targetCount, pendingAction) => {
    openPricingForCount(targetCount, pendingAction)
    return true
  }

  const generate = () => {
    if (!prompt.trim()) return
    if (needsUpgrade(count, unlockedMax)) {
      requestUpgrade(count, 'generate')
      return
    }
    runGenerate(false)
  }

  const handlePaid = (packId) => {
    setUnlockedPackId(packId)
    writeLegacyUnlock(packId)
    const pending = checkoutModal?.pendingAction
    setCheckoutModal(null)
    if (pending === 'generate' && prompt.trim()) runGenerate(false)
  }

  const emailIconsIfNeeded = async (blob, filename) => {
    if (!stripeSessionId || USE_MOCK_CHECKOUT || hasEmailedForSession(stripeSessionId)) return
    try {
      const zipBase64 = await blobToBase64(blob)
      await sendIconsEmail({ sessionId: stripeSessionId, zipBase64, filename })
      markEmailedForSession(stripeSessionId)
      setCheckoutNotice('Your icon ZIP was sent to your email.')
    } catch {
      /* download still succeeded — email is best-effort */
    }
  }

  const handleDownloadAll = async () => {
    if (!icons.length || exporting) return
    if (needsUpgrade(count, unlockedMax)) {
      requestUpgrade(count, 'download')
      return
    }
    setExporting(true)
    try {
      const { blob, filename } = await buildIconSetZip(icons, { styleId: style, color, prompt })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      await emailIconsIfNeeded(blob, filename)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadOne = useCallback(async (icon) => {
    if (needsUpgrade(count, unlockedMax)) {
      requestUpgrade(count, 'download')
      return
    }
    await downloadIconSvg(icon, { styleId: style, color })
  }, [count, unlockedMax, style, color])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate()
  }

  const selectedColor = COLORS.find((c) => c.value === color)
  const selectedStyle = STYLES.find((s) => s.id === style)

  const debouncedPrompt = useDebouncedValue(prompt, 350)
  const previewIcons = useMemo(() => {
    if (debouncedPrompt.trim()) return generateIconsFromCatalog(debouncedPrompt, 4)
    return PREVIEW_ICONS
  }, [debouncedPrompt])

  return (
    <div
      className="app-page"
      style={{
        '--app-brand': color,
        '--app-brand-soft': `${color}22`,
        '--icon-grad-from': color,
        '--icon-grad-to': '#f4a261',
      }}
    >
      {(style === 'gradient' || style === 'neon') && (
        <IconGradientDefs from={color} to="#f4a261" />
      )}
      <nav className="app-nav">
        <div className="app-nav-logo">
          <div className="app-nav-logo-icon">◆</div>
          <div>
            <span>Iconify</span>
            <span className="app-nav-badge">Studio</span>
          </div>
        </div>

        <div className="app-nav-tabs">
          <button
            type="button"
            className={`app-nav-tab${studioTab === 'create' ? ' active' : ''}`}
            onClick={() => setStudioTab('create')}
          >
            <Sparkles size={14} /> Create
          </button>
          <button
            type="button"
            className={`app-nav-tab${studioTab === 'history' ? ' active' : ''}`}
            onClick={() => setStudioTab('history')}
          >
            <History size={14} /> History
          </button>
        </div>

        <div className="app-nav-actions">
          {unlockedMax <= FREE_ICON_LIMIT && (
            <button
              type="button"
              className="app-back"
              onClick={() => openPricingForCount(36)}
            >
              Upgrade
            </button>
          )}
          <div className="app-nav-user" title={user?.email || ''}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="app-nav-avatar" />
            ) : (
              <span className="app-nav-avatar app-nav-avatar--fallback">
                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
              </span>
            )}
            <span className="app-nav-email">{user?.displayName || user?.email}</span>
          </div>
          <button type="button" className="app-back app-back--compact" onClick={onGoBack}>Home</button>
          <button type="button" className="app-signout" onClick={onSignOut} title="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      {checkoutNotice && (
        <div className="app-checkout-notice" role="status">
          {checkoutNotice}
          <button type="button" className="app-checkout-notice-dismiss" onClick={() => setCheckoutNotice('')}>✕</button>
        </div>
      )}

      {isMobile && studioTab === 'create' && (
        <div className="app-mobile-panel-tabs">
          <button
            type="button"
            className={`app-mobile-panel-tab${mobilePanel === 'controls' ? ' active' : ''}`}
            onClick={() => setMobilePanel('controls')}
          >
            Customize
          </button>
          <button
            type="button"
            className={`app-mobile-panel-tab${mobilePanel === 'preview' ? ' active' : ''}`}
            onClick={() => setMobilePanel('preview')}
          >
            Preview{state === 'done' && icons.length > 0 ? ` (${icons.length})` : ''}
          </button>
        </div>
      )}

      <div
        className={`app-body${studioTab === 'create' ? ' app-body--create' : ''}${isMobile && studioTab === 'create' ? ` app-body--${mobilePanel}` : ''}`}
      >
        {studioTab === 'create' ? (
          <>
        <aside className="app-sidebar">
          <div className="app-sidebar-header">
            <h2 className="app-sidebar-title">Create your set</h2>
            <p className="app-sidebar-sub">6 icons free — upgrade for larger sets.</p>
          </div>

          <div className="app-panel app-panel-prompt">
            <div className="app-section-label">Describe your product</div>
            <div className="app-textarea-wrap">
              {!prompt.trim() && (
                <div
                  key={placeholderIndex}
                  className="app-textarea-placeholder"
                  aria-hidden
                >
                  {PROMPT_PLACEHOLDERS[placeholderIndex]}
                </div>
              )}
              <textarea
                className="app-textarea"
                placeholder=""
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={5}
              />
            </div>
            <div className="app-hint">⌘↵ to generate</div>
          </div>

          <div className="app-panel">
            <div className="app-section-label">
              Icon style
              <span className="app-section-meta">{STYLES.length} styles</span>
            </div>
            <div className="app-style-grid">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`app-style-btn${style === s.id ? ' active' : ''}`}
                  onClick={() => setStyle(s.id)}
                >
                  <span className={`app-style-btn-icon app-style-preview--${s.id}`}>
                    <StylePreview styleId={s.id} Icon={s.Icon} active={style === s.id} />
                  </span>
                  <span className="app-style-btn-name">{s.name}</span>
                  <span className="app-style-btn-desc">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="app-panel">
            <div className="app-section-label">
              Brand color
              {selectedColor && <span className="app-color-active-name">{selectedColor.name}</span>}
            </div>
            <div className="app-colors">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`app-color${color === c.value ? ' active' : ''}`}
                  style={{ '--swatch': c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="app-panel app-panel-compact">
            <div className="app-section-label">
              Icon count
              {unlockedMax <= FREE_ICON_LIMIT && (
                <button
                  type="button"
                  className="app-upgrade-link"
                  onClick={() => openPricingForCount(36)}
                >
                  Upgrade
                </button>
              )}
            </div>
            <div className="app-count-btns">
              {ICON_COUNTS.map((n) => {
                const locked = needsUpgrade(n, unlockedMax)
                const isFree = n === FREE_ICON_LIMIT
                return (
                  <button
                    key={n}
                    type="button"
                    className={`app-count-btn${count === n ? ' active' : ''}${locked ? ' app-count-btn--locked' : ''}${isFree ? ' app-count-btn--free' : ''}`}
                    onClick={() => {
                      if (locked) {
                        openPricingForCount(n)
                        return
                      }
                      setCount(n)
                    }}
                    title={locked ? `Upgrade to unlock ${n} icons` : undefined}
                  >
                    <span className="app-count-num">{n}</span>
                    {isFree && <span className="app-count-tag">Free</span>}
                    {locked && (
                      <>
                        <Lock size={11} className="app-count-lock" aria-hidden />
                        <span className="app-count-tag app-count-tag--upgrade">Upgrade</span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="app-sidebar-actions">
            <button
              type="button"
              className="app-generate-btn"
              onClick={generate}
              disabled={!prompt.trim() || state === 'generating'}
            >
              {state === 'generating' ? (
                <><Loader2 size={16} className="app-spin" /> Generating…</>
              ) : (
                <><Sparkles size={16} /> Generate {count} Icons</>
              )}
            </button>

            {state === 'done' && (
              <button
                type="button"
                className="app-generate-btn app-generate-btn-secondary"
                onClick={() => { setState('empty'); setIcons([]); setPrompt(''); setGenVariant(0) }}
              >
                <RefreshCw size={15} /> Start over
              </button>
            )}
          </div>
        </aside>

        <main className={`app-canvas${state === 'done' ? ' app-canvas--filled' : ''}`}>
          {state === 'empty' && (
            <div className="app-empty">
              <p className="canvas-preview-label">Style preview</p>
              <MemoCanvasStylePreview
                icons={previewIcons}
                styleId={style}
                color={color}
                styleName={selectedStyle?.name}
                colorName={selectedColor?.name}
              />
              <p className="canvas-preview-hint">
                {prompt.trim() ? 'Hit generate when ready' : 'Describe your product to begin'}
              </p>
            </div>
          )}

          {state === 'generating' && (
            <div className="generating">
              <Loader2 size={32} strokeWidth={1.5} className="app-spin" />
              <div className="gen-title">Generating…</div>
              <div className="gen-sub">{genMsg}</div>
            </div>
          )}

          {state === 'done' && icons.length > 0 && (
            <>
              <div className="canvas-toolbar">
                <div className="canvas-toolbar-info">
                  <span className="canvas-pill">{icons.length} icons</span>
                  {icons.some((icon) => icon.nounId) && (
                    <span className="canvas-pill canvas-pill-noun">Noun Project</span>
                  )}
                  <span className="canvas-pill">{selectedStyle?.name}</span>
                  <span className="canvas-pill canvas-pill-color" style={{ '--pill-color': color }}>
                    {selectedColor?.name}
                  </span>
                </div>
                <div className="toolbar-actions">
                  <button
                    type="button"
                    className="toolbar-btn toolbar-btn-outline"
                    onClick={() => {
                      if (needsUpgrade(count, unlockedMax)) {
                        requestUpgrade(count, 'generate')
                        return
                      }
                      runGenerate(true)
                    }}
                  >
                    <RefreshCw size={13} /> Regenerate
                  </button>
                  <button
                    type="button"
                    className="toolbar-btn toolbar-btn-primary"
                    onClick={handleDownloadAll}
                    disabled={exporting}
                  >
                    <Download size={13} /> {exporting ? 'Exporting…' : 'Download All (.zip)'}
                  </button>
                </div>
              </div>
              <div className="icons-grid">
                {icons.map((icon, i) => (
                  <IconCard
                    key={`${icon.name}-${i}`}
                    icon={icon}
                    styleId={style}
                    color={color}
                    onDownload={() => handleDownloadOne(icon)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
          </>
        ) : (
          <main className="app-canvas app-canvas--history">
            <Suspense fallback={
              <div className="generating">
                <Loader2 size={28} className="app-spin" />
              </div>
            }>
              <HistoryPanel
                items={history}
                loading={historyLoading}
                onLoad={loadGeneration}
                onDelete={handleDeleteGeneration}
                styleNameFor={styleNameFor}
                colorNameFor={colorNameFor}
              />
            </Suspense>
          </main>
        )}
      </div>

      {pricingModal && (
        <PricingModal
          targetCount={pricingModal.targetCount}
          suggestedPackId={pricingModal.suggestedPackId}
          onClose={() => setPricingModal(null)}
          onSelectPack={handleSelectPack}
        />
      )}

      {checkoutModal && (
        <CheckoutModal
          packId={checkoutModal.packId}
          iconCount={checkoutModal.iconCount}
          orderContext={checkoutModal.orderContext}
          onClose={() => setCheckoutModal(null)}
          onSwitch={(packId) => setCheckoutModal((m) => ({ ...m, packId }))}
          onPaid={handlePaid}
        />
      )}
    </div>
  )
}
