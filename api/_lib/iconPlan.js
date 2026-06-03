const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'with',
  'my', 'our', 'your', 'is', 'are', 'app', 'tool', 'platform', 'service', 'site', 'saas',
  'create', 'icons', 'icon', 'make', 'build', 'that', 'this', 'will', 'can',
])

/** Core navigation icons most apps need */
const APP_SHELL = [
  { label: 'home', searchQuery: 'home', priority: 2 },
  { label: 'search', searchQuery: 'search', priority: 2 },
  { label: 'settings', searchQuery: 'settings', priority: 2 },
  { label: 'profile', searchQuery: 'user profile', priority: 2 },
  { label: 'notifications', searchQuery: 'notification bell', priority: 2 },
]

/** Domain-specific icon slots — each maps to what users actually need in that product */
const DOMAIN_SLOTS = {
  golf: [
    { label: 'tee-time', searchQuery: 'golf tee time', priority: 10 },
    { label: 'booking', searchQuery: 'calendar booking', priority: 9 },
    { label: 'golf-course', searchQuery: 'golf course', priority: 9 },
    { label: 'flagstick', searchQuery: 'golf flag hole', priority: 8 },
    { label: 'scorecard', searchQuery: 'golf scorecard', priority: 8 },
    { label: 'players', searchQuery: 'golf players group', priority: 7 },
    { label: 'weather', searchQuery: 'weather forecast', priority: 7 },
    { label: 'payment', searchQuery: 'payment credit card', priority: 7 },
    { label: 'map', searchQuery: 'map location', priority: 6 },
    { label: 'waitlist', searchQuery: 'waiting list queue', priority: 6 },
    { label: 'membership', searchQuery: 'membership card', priority: 5 },
    { label: 'pro-shop', searchQuery: 'golf shop', priority: 5 },
  ],
  fintech: [
    { label: 'wallet', searchQuery: 'wallet money', priority: 10 },
    { label: 'transfer', searchQuery: 'money transfer', priority: 9 },
    { label: 'savings', searchQuery: 'piggy bank savings', priority: 9 },
    { label: 'budget', searchQuery: 'budget chart', priority: 8 },
    { label: 'card', searchQuery: 'credit card', priority: 8 },
    { label: 'invest', searchQuery: 'stock investment', priority: 7 },
    { label: 'security', searchQuery: 'lock security', priority: 7 },
    { label: 'receipt', searchQuery: 'receipt bill', priority: 6 },
  ],
  food: [
    { label: 'menu', searchQuery: 'restaurant menu', priority: 10 },
    { label: 'order', searchQuery: 'food order', priority: 9 },
    { label: 'delivery', searchQuery: 'food delivery', priority: 9 },
    { label: 'restaurant', searchQuery: 'restaurant', priority: 8 },
    { label: 'reservation', searchQuery: 'table reservation', priority: 8 },
    { label: 'chef', searchQuery: 'chef cooking', priority: 6 },
  ],
  health: [
    { label: 'heart-rate', searchQuery: 'heart rate', priority: 10 },
    { label: 'workout', searchQuery: 'fitness workout', priority: 9 },
    { label: 'meditation', searchQuery: 'meditation', priority: 8 },
    { label: 'sleep', searchQuery: 'sleep', priority: 7 },
    { label: 'nutrition', searchQuery: 'healthy food', priority: 7 },
  ],
  travel: [
    { label: 'flight', searchQuery: 'airplane flight', priority: 10 },
    { label: 'hotel', searchQuery: 'hotel', priority: 9 },
    { label: 'booking', searchQuery: 'travel booking', priority: 9 },
    { label: 'map', searchQuery: 'travel map', priority: 8 },
    { label: 'luggage', searchQuery: 'luggage suitcase', priority: 7 },
  ],
  music: [
    { label: 'play', searchQuery: 'play music', priority: 10 },
    { label: 'playlist', searchQuery: 'playlist', priority: 9 },
    { label: 'microphone', searchQuery: 'microphone', priority: 8 },
    { label: 'headphones', searchQuery: 'headphones', priority: 8 },
    { label: 'concert', searchQuery: 'concert', priority: 6 },
  ],
  ecommerce: [
    { label: 'cart', searchQuery: 'shopping cart', priority: 10 },
    { label: 'product', searchQuery: 'product box', priority: 9 },
    { label: 'checkout', searchQuery: 'checkout payment', priority: 9 },
    { label: 'shipping', searchQuery: 'package shipping', priority: 8 },
    { label: 'wishlist', searchQuery: 'wishlist heart', priority: 6 },
  ],
  social: [
    { label: 'feed', searchQuery: 'social feed', priority: 10 },
    { label: 'message', searchQuery: 'chat message', priority: 9 },
    { label: 'friends', searchQuery: 'friends group', priority: 9 },
    { label: 'share', searchQuery: 'share', priority: 8 },
    { label: 'like', searchQuery: 'heart like', priority: 7 },
  ],
  productivity: [
    { label: 'tasks', searchQuery: 'checklist tasks', priority: 10 },
    { label: 'calendar', searchQuery: 'calendar', priority: 9 },
    { label: 'notes', searchQuery: 'notes document', priority: 8 },
    { label: 'project', searchQuery: 'project folder', priority: 7 },
    { label: 'deadline', searchQuery: 'deadline clock', priority: 7 },
  ],
}

const DOMAIN_DETECTORS = [
  { id: 'golf', pattern: /\bgolf\b|tee time|tee-time|fairway|putt|caddy|handicap/i },
  { id: 'fintech', pattern: /\bfintech\b|\bbank\b|banking|wallet|invest|crypto|budget|savings|finance|payment/i },
  { id: 'food', pattern: /food|restaurant|menu|recipe|cook|dining|delivery|kitchen|cafe/i },
  { id: 'health', pattern: /health|wellness|medical|fitness|workout|meditation|mindful/i },
  { id: 'travel', pattern: /travel|trip|flight|hotel|vacation|booking|destination/i },
  { id: 'music', pattern: /music|musician|audio|podcast|band|concert|playlist/i },
  { id: 'ecommerce', pattern: /ecommerce|e-commerce|shop|store|retail|marketplace|cart/i },
  { id: 'social', pattern: /social|friend|post|feed|follow|chat|community/i },
  { id: 'productivity', pattern: /task|todo|note|productivity|workflow|project|planner/i },
]

/** Map prompt verbs/nouns to concrete icon search queries */
const KEYWORD_SLOTS = [
  { pattern: /\bbook(ing|er)?\b|reserv(e|ation)\b|schedule\b/i, label: 'booking', searchQuery: 'calendar booking', priority: 9 },
  { pattern: /\bcalendar\b|schedule\b/i, label: 'calendar', searchQuery: 'calendar', priority: 8 },
  { pattern: /\bpay(ment)?\b|checkout\b|billing\b/i, label: 'payment', searchQuery: 'payment', priority: 8 },
  { pattern: /\bmap\b|location\b|directions\b/i, label: 'map', searchQuery: 'map pin location', priority: 8 },
  { pattern: /\bchat\b|message\b|inbox\b/i, label: 'messages', searchQuery: 'chat message', priority: 7 },
  { pattern: /\banalytics\b|stats\b|dashboard\b|chart\b/i, label: 'analytics', searchQuery: 'bar chart analytics', priority: 7 },
  { pattern: /\bupload\b|download\b|export\b/i, label: 'download', searchQuery: 'download', priority: 6 },
  { pattern: /\bfavorite\b|wishlist\b|save\b/i, label: 'favorite', searchQuery: 'bookmark favorite', priority: 6 },
  { pattern: /\bfilter\b|sort\b/i, label: 'filter', searchQuery: 'filter', priority: 5 },
  { pattern: /\bhelp\b|support\b|faq\b/i, label: 'help', searchQuery: 'help question', priority: 5 },
]

function tokenize(prompt) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
}

function detectDomains(prompt) {
  return DOMAIN_DETECTORS.filter(({ pattern }) => pattern.test(prompt)).map((d) => d.id)
}

/**
 * Build an ordered list of icon slots to search — mimics planning a real app icon set.
 * @param {string} prompt
 * @param {number} count
 */
export function buildIconPlan(prompt, count) {
  const trimmed = prompt.trim()
  if (!trimmed) return []

  const domains = detectDomains(trimmed)
  const slots = new Map()

  const addSlot = (slot) => {
    if (!slots.has(slot.label)) slots.set(slot.label, slot)
  }

  for (const domain of domains) {
    for (const slot of DOMAIN_SLOTS[domain] || []) addSlot(slot)
  }

  for (const { pattern, ...slot } of KEYWORD_SLOTS) {
    if (pattern.test(trimmed)) addSlot(slot)
  }

  for (const token of tokenize(trimmed)) {
    if (token.length > 3) {
      addSlot({ label: token, searchQuery: token, priority: 6 })
    }
  }

  const shellCount = Math.min(4, Math.max(2, Math.floor(count * 0.15)))
  for (const slot of APP_SHELL.slice(0, shellCount)) addSlot(slot)

  return [...slots.values()]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, count)
}

/**
 * Score how well a Noun Project result matches the prompt and intended slot.
 */
export function scoreNounIcon(icon, { prompt, slot, tokens }) {
  const fullText = prompt.toLowerCase()
  const term = (icon.term || '').toLowerCase()
  const tags = (icon.tags || []).map((t) => t.toLowerCase())
  let score = 0

  if (slot?.searchQuery) {
    const q = slot.searchQuery.toLowerCase()
    if (term.includes(q) || q.includes(term)) score += 40
    for (const word of q.split(/\s+/)) {
      if (word.length > 2 && tags.some((t) => t.includes(word))) score += 12
      if (word.length > 2 && term.includes(word)) score += 10
    }
    if (slot.label && term.replace(/\s+/g, '-').includes(slot.label.replace(/\s+/g, '-'))) score += 25
  }

  for (const token of tokens) {
    if (token.length < 3) continue
    if (term.includes(token)) score += 8
    if (tags.some((t) => t === token || t.includes(token))) score += 14
    if (fullText.includes(token) && tags.some((t) => t.includes(token))) score += 6
  }

  if (term && fullText.includes(term)) score += 20

  return score
}

export function hashPrompt(prompt) {
  let h = 0
  for (let i = 0; i < prompt.length; i++) h = (h * 31 + prompt.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function seededShuffle(arr, seed) {
  const out = [...arr]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export { tokenize, detectDomains }
