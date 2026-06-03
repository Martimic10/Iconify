import { useState } from 'react'
import CheckoutModal from '../components/CheckoutModal'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { PACKS } from '../lib/pricing'
import {
  Zap, Sparkles, Palette, Gem, Star, Flame, Wand2, Layers,
  Square, Box, Grid2x2, Pencil,
  Home, Settings, Search, User, Bell, Heart, BarChart2, Folder,
  ChevronDown, Check,
} from 'lucide-react'

/* ---- data ---- */
const HERO_ICONS = [Zap, Sparkles, Palette, Gem, Star, Flame, Wand2, Layers]

const BRANDS = [
  { name: 'Notion',      slug: 'notion' },
  { name: 'Stripe',      slug: 'stripe' },
  { name: 'Linear',      slug: 'linear' },
  { name: 'Figma',       slug: 'figma' },
  { name: 'Vercel',      slug: 'vercel' },
  { name: 'GitHub',      slug: 'github' },
  { name: 'Slack',       slug: 'slack' },
  { name: 'Tailwind',    slug: 'tailwindcss' },
  { name: 'Next.js',     slug: 'nextdotjs' },
  { name: 'Framer',      slug: 'framer' },
  { name: 'Supabase',    slug: 'supabase' },
  { name: 'Prisma',      slug: 'prisma' },
  { name: 'React',       slug: 'react' },
  { name: 'TypeScript',  slug: 'typescript' },
]

const STYLES = [
  { Icon: () => <Square size={18} fill="currentColor" strokeWidth={0} />, name: 'Flat' },
  { Icon: () => <Square size={18} strokeWidth={1.5} />, name: 'Outline' },
  { Icon: () => <Layers size={18} strokeWidth={1.5} />, name: 'Duotone' },
  { Icon: () => <Box size={18} strokeWidth={1.5} />, name: '3D' },
  { Icon: () => <Grid2x2 size={18} strokeWidth={1.5} />, name: 'Pixel' },
  { Icon: () => <Pencil size={18} strokeWidth={1.5} />, name: 'Sketchy' },
]

const COLOR_ROWS = [
  { shades: ['#7c1e1e', '#b22c2c', '#e63946', '#f47a82', '#fcd4d7'] },
  { shades: ['#1a2b4e', '#2552a0', '#3b7dd8', '#7fb3ed', '#d1e7fd'] },
  { shades: ['#0d3320', '#1a6640', '#2dab6b', '#78d4a5', '#cef2e2'] },
  { shades: ['#2e0d47', '#5a1f89', '#8c44c8', '#c08ee8', '#e8d3f9'] },
]

const EXPORTS = ['SVG', '16px', '32px', '64px', '128px', '.zip']

const LICENSE_ITEMS = [
  'Commercial use in any product',
  'Unlimited client projects',
  'No attribution required',
  'Lifetime access & updates',
  'Redistribution in design kits',
]

const CONSISTENCY_ICONS = [Home, Settings, Search, User, Bell, Heart, BarChart2, Folder]

const HIW_STEPS = [
  {
    num: 1, side: 'left',
    title: 'Describe your product',
    body: 'Tell us what your app does in plain English. The more context you give, the better your icons will match your product\'s personality.',
    snippet: '"A fintech app for Gen Z savers"',
  },
  {
    num: 2, side: 'right',
    title: 'Choose style & color',
    body: 'Pick from 6 visual styles and your brand\'s primary color. Iconify adapts every icon to feel native to your design system.',
    snippet: 'style: outline  ·  color: #e63946',
  },
  {
    num: 3, side: 'left',
    title: 'Generate your set',
    body: 'Our AI generates a complete, consistent icon set in seconds. Every icon follows the same visual grammar so they look like a family.',
    snippet: '→ Generating 36 icons  ·  ~8 sec',
  },
  {
    num: 4, side: 'right',
    title: 'Download & ship',
    body: 'Get SVGs, PNGs at 4 sizes, and a ready-to-use ZIP. Drop them straight into Figma, your codebase, or your design tokens.',
    snippet: 'icons.zip  ·  SVG + 16/32/64/128px',
  },
]

const FAQS = [
  {
    q: 'Do I need design skills to use Iconify?',
    a: 'Not at all. Just describe your product in plain English and pick a style. Iconify handles everything else. If you can write a sentence, you can generate a professional icon set.',
  },
  {
    q: 'What file formats do I get?',
    a: 'Every pack includes SVG files plus PNG exports at 16×16, 32×32, 64×64, and 128×128 pixels. Studio orders also include WebP. All files arrive in a single organized ZIP.',
  },
  {
    q: 'Can I use the icons commercially?',
    a: 'Yes — every pack includes a lifetime commercial license. Use them in products, client work, SaaS apps, mobile apps, websites, or marketing materials with no attribution required.',
  },
  {
    q: 'Can I regenerate icons if I don\'t like them?',
    a: 'Pro and Studio packs include 3 style variation attempts. If your first generation isn\'t quite right, tweak your description or pick a different style and try again at no extra cost.',
  },
  {
    q: 'How many icons can I generate for free?',
    a: 'You can generate and download up to 6 icons at no cost with a free account. Need more? Upgrade to Starter (12), Pro (36), or Studio (100) with a one-time payment.',
  },
  {
    q: 'Do I need an account?',
    a: 'Yes — sign in with Google to access the studio and save your generation history. Takes one click.',
  },
  {
    q: 'How is this different from Feather, Heroicons, or other libraries?',
    a: 'Generic libraries give you the same icons as everyone else. Iconify generates icons designed specifically around your product\'s context, style, and brand — so your app has a unique visual identity.',
  },
  {
    q: 'What\'s your refund policy?',
    a: 'We offer a 7-day refund if you\'re not satisfied. Just email us with your order and we\'ll issue a full refund, no questions asked. We want you to love your icons.',
  },
]

/* ---- Hero ---- */
function Hero({ onGoToApp, isSignedIn }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-dots" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-powered icon generation
        </div>
        <h1 className="hero-headline">
          Your brand deserves<br />
          <span className="gradient-text">its own icons.</span>
        </h1>
        <p className="hero-sub">
          Describe your product, pick a style, and get a complete custom icon set in seconds — consistent, commercial-ready, and uniquely yours.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={onGoToApp} style={{ fontSize: 15, padding: '14px 32px' }}>
            {isSignedIn ? 'Open Studio →' : 'Sign in with Google →'}
          </button>
          <a href="#how-it-works" className="btn-ghost">See how it works ↓</a>
        </div>
        <div className="hero-icons-row">
          {HERO_ICONS.map((Icon, i) => (
            <div key={i} className="hero-float-icon">
              <Icon size={20} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Social Proof ---- */
function SocialProof() {
  const items = [...BRANDS, ...BRANDS]
  return (
    <section className="social-proof">
      <div className="marquee-wrap">
        <div className="marquee-track">
          {items.map((b, i) => (
            <span key={i} className="marquee-item">
              <img
                src={`https://cdn.simpleicons.org/${b.slug}`}
                alt={b.name}
                className="marquee-logo"
                height="22"
                width="22"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Features ---- */
function Features() {
  return (
    <section id="features" style={{ padding: '120px 0' }}>
      <div className="container">
        <div className="section-header">
          <div><span className="tag">Features</span></div>
          <h2 className="section-title">Everything your icon set needs</h2>
          <p className="section-sub">Six styles, full color control, and all the export formats your workflow demands.</p>
        </div>
        <div className="features-bento">
          {/* Row 1 */}
          <div className="bento-row bento-row-1">
            <div className="bento-card">
              <div className="bento-card-tag">Style system</div>
              <div className="bento-card-title">6 Distinct Styles</div>
              <p className="bento-card-desc">From sharp flat fills to hand-drawn sketches — every aesthetic is covered.</p>
              <div className="styles-grid">
                {STYLES.map((s) => (
                  <div key={s.name} className="style-tile">
                    <div className="style-tile-icon"><s.Icon /></div>
                    <span className="style-tile-name">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bento-card">
              <div className="bento-card-tag">Color system</div>
              <div className="bento-card-title">Brand Colors</div>
              <p className="bento-card-desc">Every icon generated in your exact brand palette — dark to light, all tints included.</p>
              <div className="color-rows">
                {COLOR_ROWS.map((row, ri) => (
                  <div key={ri} className="color-row">
                    {row.shades.map((c, ci) => (
                      <div key={ci} className="color-swatch" style={{ background: c }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Row 2 */}
          <div className="bento-row bento-row-2">
            <div className="bento-card">
              <div className="bento-card-tag">Export</div>
              <div className="bento-card-title">Ship-Ready Formats</div>
              <p className="bento-card-desc">Every size your team needs, organized and ready to drop into any codebase or design tool.</p>
              <div className="export-tiles">
                {EXPORTS.map((e) => (
                  <div key={e} className="export-tile">
                    <span className="export-tile-dot" />
                    {e}
                  </div>
                ))}
              </div>
            </div>
            <div className="bento-card">
              <div className="bento-card-tag">License</div>
              <div className="bento-card-title">Own It Fully</div>
              <p className="bento-card-desc">Commercial license included in every pack.</p>
              <div className="license-list">
                {LICENSE_ITEMS.map((item) => (
                  <div key={item} className="license-item">
                    <span className="license-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Row 3 */}
          <div className="bento-row bento-row-3">
            <div className="bento-card">
              <div className="consistency-inner">
                <div className="consistency-text">
                  <div className="bento-card-tag">Consistency</div>
                  <div className="bento-card-title">Built as a family,<br />not a collection</div>
                  <p className="bento-card-desc" style={{ marginBottom: 0 }}>
                    Every icon in your set shares the same stroke weight, corner radius, and visual density. They look like they were drawn by one hand — because effectively, they were.
                  </p>
                </div>
                <div className="consistency-icon-grid">
                  {CONSISTENCY_ICONS.map((Icon, i) => (
                    <div key={i} className="ci-icon">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- How It Works ---- */
function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '120px 0' }}>
      <div className="container">
        <div className="section-header">
          <div><span className="tag">Process</span></div>
          <h2 className="section-title">From idea to icon set<br />in four steps</h2>
          <p className="section-sub">No design degree, no Figma subscription, no waiting on a freelancer.</p>
        </div>
        <div className="hiw-wrapper">
          <div className="hiw-line" />
          {HIW_STEPS.map((step) => (
            <div key={step.num} className={`hiw-step hiw-step-${step.side}`}>
              {step.side === 'left' ? (
                <>
                  <div className="hiw-card">
                    <div className="hiw-card-title">{step.title}</div>
                    <div className="hiw-card-body">{step.body}</div>
                    <div className="hiw-snippet">{step.snippet}</div>
                  </div>
                  <div className="hiw-step-num">{step.num}</div>
                  <div className="hiw-empty" />
                </>
              ) : (
                <>
                  <div className="hiw-empty" />
                  <div className="hiw-step-num">{step.num}</div>
                  <div className="hiw-card">
                    <div className="hiw-card-title">{step.title}</div>
                    <div className="hiw-card-body">{step.body}</div>
                    <div className="hiw-snippet">{step.snippet}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Pricing ---- */
function Pricing() {
  const [modal, setModal] = useState(null)

  return (
    <>
      <section id="pricing" style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="section-header">
            <div><span className="tag">Pricing</span></div>
            <h2 className="section-title">One-time packs.<br />No subscriptions.</h2>
            <p className="section-sub">Start with 6 icons free. Pay once for larger sets — commercial license included.</p>
          </div>
          <div className="pricing-grid">
            {PACKS.map((pack) => (
              <div key={pack.id} className={`pricing-card${pack.popular ? ' pricing-card-popular' : ''}`}>
                <div className="pricing-card-header">
                  <span className="pricing-pack-name">{pack.name}</span>
                  {pack.popular && <span className="pricing-popular-label">Most Popular</span>}
                </div>
                <div className="pricing-price-row">
                  <span className="pricing-dollar">$</span>
                  <span className="pricing-amount">{pack.price}</span>
                </div>
                <div className="pricing-per">{pack.perIcon} · {pack.icons} icons</div>
                <button
                  className={`pricing-cta ${pack.popular ? 'pricing-cta-primary' : 'pricing-cta-ghost'}`}
                  onClick={() => setModal(pack.id)}
                >
                  Get {pack.name} Pack →
                </button>
                <hr className="pricing-divider" />
                <div className="pricing-audience">{pack.audience}</div>
                <ul className="pricing-features">
                  {pack.features.map((f) => (
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
      </section>
      {modal && (
        <CheckoutModal
          packId={modal}
          iconCount={PACKS.find((p) => p.id === modal)?.icons}
          orderContext={{ count: PACKS.find((p) => p.id === modal)?.icons }}
          onClose={() => setModal(null)}
          onSwitch={setModal}
        />
      )}
    </>
  )
}

/* ---- FAQ ---- */
function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ padding: '120px 0' }}>
      <div className="container">
        <div className="section-header">
          <div><span className="tag">FAQ</span></div>
          <h2 className="section-title">Questions? Answered.</h2>
          <p className="section-sub">Everything you need to know before hitting Generate.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.q}</span>
                <ChevronDown size={18} className={`faq-chevron${open === i ? ' open' : ''}`} />
              </div>
              <div className={`faq-answer${open === i ? ' open' : ''}`}>
                <div className="faq-answer-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- Final CTA ---- */
function FinalCTA({ onGoToApp, isSignedIn }) {
  return (
    <section className="final-cta">
      <div className="final-cta-glow" />
      <div className="final-cta-logo">◆</div>
      <h2 className="final-cta-headline">
        Your icon set is<br />
        <span className="gradient-text">30 seconds away.</span>
      </h2>
      <p className="final-cta-sub">No design skills, no Figma, no waiting. Just describe and generate.</p>
      <button className="btn-primary" onClick={onGoToApp} style={{ fontSize: 15, padding: '14px 32px' }}>
        {isSignedIn ? 'Open Studio →' : 'Sign in with Google →'}
      </button>
      <p className="final-cta-fine">Sign in with Google · 6 icons free · Commercial license included</p>
    </section>
  )
}

/* ---- Landing Page ---- */
export default function Landing({ onGoToApp, onGoHome, isSignedIn, theme, toggleTheme }) {
  return (
    <div data-theme={theme} style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav
        onGoHome={onGoHome}
        onGoToApp={onGoToApp}
        isSignedIn={isSignedIn}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Hero onGoToApp={onGoToApp} isSignedIn={isSignedIn} />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA onGoToApp={onGoToApp} isSignedIn={isSignedIn} />
      <SiteFooter />
    </div>
  )
}
