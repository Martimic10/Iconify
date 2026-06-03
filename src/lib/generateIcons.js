import {
  Home, Settings, Search, User, Bell, Heart, BarChart2, Folder,
  Zap, CreditCard, Wallet, Landmark, Lock, TrendingUp, Smartphone,
  CheckCircle, ArrowLeftRight, Coins, Banknote, TrendingDown,
  Receipt, Target, Globe, Link, FileText, Send, Shield, Gift,
  Phone, Key, MessageCircle, Camera, Star, Tag, Music, Video,
  Users, Calendar, MapPin, Moon, Lightbulb, RefreshCw, Save,
  Download, Trash2, Edit3, Share2, Rocket, LayoutDashboard,
  Clipboard, Archive, Palette, Pin, Mail, Package, Code, Database,
  Flag, Trophy, Clock, CalendarClock, Sun, CloudSun, Wind, Car,
  ShoppingBag, Utensils, Stethoscope, GraduationCap, Plane, Hotel,
  Dumbbell, HeartPulse, BookOpen, Store, Truck, Timer, Award, Medal,
  Trees, Mic, Headphones, Gamepad2, Dog, Coffee,
  Building2, HelpCircle, Info, Filter, Layers, Grid2x2, List, Plus,
  Navigation, Compass, Umbrella, ThermometerSun, CircleCheck, Ban,
  QrCode, ScanLine, Eye, Bookmark, Repeat, RotateCcw, CircleUser,
  Wallet2, BadgeCheck, Megaphone, Volume2, Wifi,
} from 'lucide-react'

/** @typedef {{ name: string, Icon: import('react').ComponentType, keywords: string[], themes?: string[], universal?: boolean }} IconDef */

/** @type {{ id: string, pattern: RegExp }[]} */
const THEME_DETECTORS = [
  { id: 'golf', pattern: /\bgolf\b|tee time|tee-time|fairway|putt|putting|caddy|handicap|birdie|bogey|\bpar\b/i },
  { id: 'sports', pattern: /\bsport\b|fitness|gym|workout|athlete|league|tournament|coach/i },
  { id: 'fintech', pattern: /\bfintech\b|\bbank\b|banking|money|wallet|invest|crypto|trade|budget|savings|finance|payment/i },
  { id: 'social', pattern: /social|friend|post|feed|follow|share|like|chat|community|network/i },
  { id: 'health', pattern: /health|wellness|medical|clinic|doctor|patient|therapy|mindful|meditation/i },
  { id: 'food', pattern: /food|restaurant|menu|recipe|cook|dining|delivery|kitchen|cafe|coffee/i },
  { id: 'ecommerce', pattern: /ecommerce|e-commerce|shop|store|retail|checkout|product|marketplace/i },
  { id: 'education', pattern: /learn|education|course|school|student|teacher|tutor|study|classroom/i },
  { id: 'travel', pattern: /travel|trip|flight|hotel|booking|vacation|tour|destination|airbnb/i },
  { id: 'music', pattern: /music|musician|audio|podcast|band|concert|stream|playlist/i },
  { id: 'realestate', pattern: /real estate|property|rent|lease|apartment|housing|mortgage|listing/i },
  { id: 'pets', pattern: /pet|dog|cat|vet|animal|puppy|adoption/i },
  { id: 'productivity', pattern: /task|todo|note|productivity|workflow|project plan|planner/i },
  { id: 'dev', pattern: /developer|code|api|software|engineer|startup|tech platform/i },
]

/** @type {IconDef[]} */
const ICON_CATALOG = [
  // Golf & sports scheduling
  { name: 'tee-time', Icon: CalendarClock, keywords: ['golf', 'tee', 'time', 'schedule', 'scheduler', 'booking', 'reserve', 'appointment', 'slot'], themes: ['golf'] },
  { name: 'course', Icon: MapPin, keywords: ['golf', 'course', 'club', 'venue', 'location', 'field', 'site'], themes: ['golf'] },
  { name: 'flagstick', Icon: Flag, keywords: ['golf', 'flag', 'hole', 'pin', 'green', 'cup'], themes: ['golf', 'sports'] },
  { name: 'scorecard', Icon: Clipboard, keywords: ['golf', 'score', 'card', 'handicap', 'stats', 'round'], themes: ['golf', 'sports'] },
  { name: 'foursome', Icon: Users, keywords: ['golf', 'group', 'players', 'foursome', 'party', 'team'], themes: ['golf'] },
  { name: 'leaderboard', Icon: Trophy, keywords: ['golf', 'leader', 'rank', 'tournament', 'win', 'champion'], themes: ['golf', 'sports'] },
  { name: 'fairway', Icon: Trees, keywords: ['golf', 'fairway', 'grass', 'outdoor', 'nature', 'green'], themes: ['golf'] },
  { name: 'pro-shop', Icon: ShoppingBag, keywords: ['golf', 'shop', 'gear', 'equipment', 'pro', 'retail'], themes: ['golf', 'ecommerce'] },
  { name: 'golf-cart', Icon: Car, keywords: ['golf', 'cart', 'ride', 'transport', 'vehicle'], themes: ['golf'] },
  { name: 'weather', Icon: CloudSun, keywords: ['golf', 'weather', 'rain', 'sun', 'forecast', 'outdoor'], themes: ['golf', 'travel'] },
  { name: 'wind', Icon: Wind, keywords: ['golf', 'wind', 'weather', 'conditions'], themes: ['golf'] },
  { name: 'practice', Icon: Target, keywords: ['golf', 'practice', 'range', 'target', 'drill', 'training'], themes: ['golf', 'sports'] },
  { name: 'membership', Icon: Award, keywords: ['golf', 'member', 'club', 'pass', 'subscription', 'tier'], themes: ['golf'] },
  { name: 'timer', Icon: Timer, keywords: ['golf', 'waitlist', 'wait', 'queue', 'timer', 'pace'], themes: ['golf'] },
  { name: 'directions', Icon: Navigation, keywords: ['golf', 'directions', 'navigate', 'route'], themes: ['golf'] },
  { name: 'yardage', Icon: Compass, keywords: ['golf', 'yardage', 'distance', 'compass'], themes: ['golf'] },
  { name: 'rain-delay', Icon: Umbrella, keywords: ['golf', 'rain', 'delay', 'weather'], themes: ['golf'] },
  { name: 'heat-index', Icon: ThermometerSun, keywords: ['golf', 'heat', 'temperature', 'weather'], themes: ['golf'] },
  { name: 'confirmed', Icon: CircleCheck, keywords: ['golf', 'confirm', 'confirmed', 'booking'], themes: ['golf'] },
  { name: 'cancellation', Icon: Ban, keywords: ['golf', 'cancel', 'cancellation', 'refund'], themes: ['golf'] },
  { name: 'check-in', Icon: QrCode, keywords: ['golf', 'checkin', 'check-in', 'qr', 'scan'], themes: ['golf'] },
  { name: 'course-map', Icon: ScanLine, keywords: ['golf', 'map', 'layout', 'scan'], themes: ['golf'] },
  { name: 'course-view', Icon: Eye, keywords: ['golf', 'view', 'preview', 'course'], themes: ['golf'] },
  { name: 'saved-course', Icon: Bookmark, keywords: ['golf', 'saved', 'favorite', 'bookmark'], themes: ['golf'] },
  { name: 'rebook', Icon: Repeat, keywords: ['golf', 'rebook', 'repeat', 'again'], themes: ['golf'] },
  { name: 'reschedule', Icon: RotateCcw, keywords: ['golf', 'reschedule', 'change', 'move'], themes: ['golf'] },
  { name: 'player-profile', Icon: CircleUser, keywords: ['golf', 'profile', 'player', 'account'], themes: ['golf'] },
  { name: 'pay-greenfee', Icon: Wallet2, keywords: ['golf', 'pay', 'payment', 'fee', 'checkout'], themes: ['golf'] },
  { name: 'verified', Icon: BadgeCheck, keywords: ['golf', 'verified', 'badge', 'trusted'], themes: ['golf'] },
  { name: 'announcements', Icon: Megaphone, keywords: ['golf', 'announce', 'news', 'alert'], themes: ['golf'] },
  { name: 'caddie-call', Icon: Volume2, keywords: ['golf', 'caddie', 'caddy', 'call'], themes: ['golf'] },
  { name: 'club-wifi', Icon: Wifi, keywords: ['golf', 'wifi', 'connect', 'club'], themes: ['golf'] },
  { name: 'sunrise-tee', Icon: Sun, keywords: ['golf', 'sunrise', 'morning', 'early'], themes: ['golf'] },
  { name: 'twilight', Icon: Moon, keywords: ['golf', 'twilight', 'evening', 'sunset'], themes: ['golf'] },
  { name: 'lesson', Icon: GraduationCap, keywords: ['golf', 'lesson', 'coach', 'instruction'], themes: ['golf'] },

  // Sports & fitness
  { name: 'workout', Icon: Dumbbell, keywords: ['sport', 'fitness', 'gym', 'workout', 'exercise', 'train'], themes: ['sports'] },
  { name: 'pulse', Icon: HeartPulse, keywords: ['health', 'fitness', 'heart', 'vitals', 'wellness', 'sport'], themes: ['sports', 'health'] },
  { name: 'medal', Icon: Medal, keywords: ['sport', 'medal', 'award', 'achievement', 'win'], themes: ['sports'] },
  { name: 'gamepad', Icon: Gamepad2, keywords: ['game', 'gaming', 'play', 'esport', 'arcade'], themes: ['sports'] },

  // Fintech
  { name: 'card', Icon: CreditCard, keywords: ['pay', 'card', 'checkout', 'bank', 'finance', 'money'], themes: ['fintech'] },
  { name: 'wallet', Icon: Wallet, keywords: ['wallet', 'money', 'pay', 'balance', 'finance'], themes: ['fintech'] },
  { name: 'analytics', Icon: BarChart2, keywords: ['analytics', 'chart', 'stats', 'data', 'growth', 'finance'], themes: ['fintech', 'productivity'] },
  { name: 'bank', Icon: Landmark, keywords: ['bank', 'finance', 'institution', 'money'], themes: ['fintech'] },
  { name: 'transfer', Icon: ArrowLeftRight, keywords: ['transfer', 'send', 'exchange', 'money', 'pay'], themes: ['fintech'] },
  { name: 'coin', Icon: Coins, keywords: ['coin', 'crypto', 'token', 'money', 'invest'], themes: ['fintech'] },
  { name: 'cash', Icon: Banknote, keywords: ['cash', 'money', 'bill', 'pay', 'budget'], themes: ['fintech'] },
  { name: 'invoice', Icon: Receipt, keywords: ['invoice', 'receipt', 'bill', 'payment', 'finance'], themes: ['fintech'] },
  { name: 'trending', Icon: TrendingUp, keywords: ['trend', 'growth', 'invest', 'stock', 'market'], themes: ['fintech'] },

  // Social
  { name: 'profile', Icon: User, keywords: ['profile', 'user', 'account', 'social', 'identity'], themes: ['social'] },
  { name: 'message', Icon: MessageCircle, keywords: ['message', 'chat', 'talk', 'dm', 'social'], themes: ['social'] },
  { name: 'like', Icon: Heart, keywords: ['like', 'love', 'favorite', 'social', 'reaction'], themes: ['social'] },
  { name: 'photo', Icon: Camera, keywords: ['photo', 'camera', 'image', 'picture', 'social'], themes: ['social'] },
  { name: 'share', Icon: Share2, keywords: ['share', 'post', 'social', 'spread'], themes: ['social'] },
  { name: 'video', Icon: Video, keywords: ['video', 'stream', 'clip', 'social', 'content'], themes: ['social', 'music'] },
  { name: 'friends', Icon: Users, keywords: ['friend', 'people', 'community', 'group', 'social'], themes: ['social'] },
  { name: 'explore', Icon: Globe, keywords: ['explore', 'discover', 'global', 'world', 'social'], themes: ['social'] },

  // Productivity & SaaS
  { name: 'dashboard', Icon: LayoutDashboard, keywords: ['dashboard', 'overview', 'admin'], themes: ['productivity', 'dev'] },
  { name: 'calendar', Icon: Calendar, keywords: ['calendar', 'date', 'event'], themes: ['productivity'] },
  { name: 'tasks', Icon: CheckCircle, keywords: ['task', 'todo', 'done', 'complete', 'checklist'], themes: ['productivity'] },
  { name: 'notes', Icon: FileText, keywords: ['note', 'doc', 'document', 'write', 'text'], themes: ['productivity'] },
  { name: 'folder', Icon: Folder, keywords: ['folder', 'file', 'organize', 'storage'], themes: ['productivity'] },
  { name: 'sync', Icon: RefreshCw, keywords: ['sync', 'refresh', 'update', 'reload'], themes: ['productivity'] },
  { name: 'launch', Icon: Rocket, keywords: ['launch', 'startup', 'ship', 'release', 'saas'], themes: ['productivity', 'dev'] },
  { name: 'idea', Icon: Lightbulb, keywords: ['idea', 'insight', 'brainstorm', 'creative'], themes: ['productivity'] },
  { name: 'report', Icon: BarChart2, keywords: ['report', 'metric', 'kpi', 'insight', 'saas'], themes: ['productivity'] },

  // Health & wellness
  { name: 'care', Icon: Stethoscope, keywords: ['health', 'medical', 'doctor', 'clinic', 'care'], themes: ['health'] },
  { name: 'vitals', Icon: HeartPulse, keywords: ['health', 'vitals', 'wellness', 'mindful', 'routine'], themes: ['health'] },
  { name: 'rest', Icon: Moon, keywords: ['sleep', 'rest', 'night', 'calm', 'mindful'], themes: ['health'] },

  // Food & hospitality
  { name: 'menu', Icon: Utensils, keywords: ['food', 'menu', 'restaurant', 'dining', 'eat'], themes: ['food'] },
  { name: 'coffee', Icon: Coffee, keywords: ['coffee', 'cafe', 'drink', 'beverage'], themes: ['food'] },
  { name: 'delivery', Icon: Truck, keywords: ['delivery', 'ship', 'order', 'food', 'logistics'], themes: ['food', 'ecommerce'] },

  // Ecommerce
  { name: 'store', Icon: Store, keywords: ['store', 'shop', 'retail', 'ecommerce', 'marketplace'], themes: ['ecommerce'] },
  { name: 'cart', Icon: ShoppingBag, keywords: ['cart', 'shop', 'buy', 'checkout', 'ecommerce'], themes: ['ecommerce'] },
  { name: 'package', Icon: Package, keywords: ['package', 'order', 'box', 'ship', 'product'], themes: ['ecommerce'] },
  { name: 'tag', Icon: Tag, keywords: ['tag', 'label', 'price', 'sale', 'product'], themes: ['ecommerce'] },

  // Education
  { name: 'learn', Icon: BookOpen, keywords: ['learn', 'education', 'course', 'study', 'book'], themes: ['education'] },
  { name: 'graduate', Icon: GraduationCap, keywords: ['school', 'student', 'graduate', 'class', 'education'], themes: ['education'] },

  // Travel
  { name: 'flight', Icon: Plane, keywords: ['travel', 'flight', 'fly', 'airport', 'trip'], themes: ['travel'] },
  { name: 'stay', Icon: Hotel, keywords: ['hotel', 'stay', 'lodging', 'travel', 'booking'], themes: ['travel'] },
  { name: 'map', Icon: MapPin, keywords: ['map', 'location', 'place', 'travel', 'destination'], themes: ['travel'] },

  // Music & media
  { name: 'music', Icon: Music, keywords: ['music', 'audio', 'song', 'playlist', 'musician'], themes: ['music'] },
  { name: 'mic', Icon: Mic, keywords: ['podcast', 'mic', 'voice', 'record', 'audio'], themes: ['music'] },
  { name: 'headphones', Icon: Headphones, keywords: ['listen', 'headphones', 'audio', 'stream'], themes: ['music'] },

  // Real estate
  { name: 'property', Icon: Building2, keywords: ['property', 'real estate', 'building', 'listing', 'rent'], themes: ['realestate'] },
  { name: 'home', Icon: Home, keywords: ['home', 'house', 'property', 'listing', 'rent'], themes: ['realestate'] },

  // Pets
  { name: 'pets', Icon: Dog, keywords: ['pet', 'dog', 'cat', 'animal', 'vet'], themes: ['pets'] },

  // Dev & tech
  { name: 'code', Icon: Code, keywords: ['code', 'dev', 'developer', 'software', 'api'], themes: ['dev'] },
  { name: 'database', Icon: Database, keywords: ['database', 'data', 'backend', 'storage', 'api'], themes: ['dev'] },
  { name: 'layers', Icon: Layers, keywords: ['stack', 'layer', 'component', 'architecture'], themes: ['dev'] },

  // Universal — only when prompt explicitly mentions them
  { name: 'search', Icon: Search, keywords: ['search', 'find', 'lookup', 'browse'], universal: true },
  { name: 'settings', Icon: Settings, keywords: ['settings', 'config', 'preferences'], universal: true },
  { name: 'notify', Icon: Bell, keywords: ['notify', 'notification', 'alert', 'remind'], universal: true },
  { name: 'secure', Icon: Lock, keywords: ['secure', 'lock', 'privacy', 'auth', 'login'], universal: true },
  { name: 'support', Icon: HelpCircle, keywords: ['support', 'help', 'faq'], universal: true },
  { name: 'mobile', Icon: Smartphone, keywords: ['mobile', 'iphone', 'android'], universal: true },
  { name: 'link', Icon: Link, keywords: ['link', 'url', 'integrate'], universal: true },
  { name: 'save', Icon: Save, keywords: ['save', 'persist'], universal: true },
  { name: 'edit', Icon: Edit3, keywords: ['edit', 'modify', 'update'], universal: true },
  { name: 'delete', Icon: Trash2, keywords: ['delete', 'remove', 'trash'], universal: true },
  { name: 'filter', Icon: Filter, keywords: ['filter', 'sort', 'refine'], universal: true },
  { name: 'star', Icon: Star, keywords: ['star', 'rating', 'review'], universal: true },
  { name: 'gift', Icon: Gift, keywords: ['gift', 'reward', 'bonus', 'promo'], universal: true },
  { name: 'key', Icon: Key, keywords: ['key', 'access', 'token'], universal: true },
  { name: 'shield', Icon: Shield, keywords: ['shield', 'protect', 'security'], universal: true },
  { name: 'mail', Icon: Mail, keywords: ['mail', 'email', 'inbox'], universal: true },
  { name: 'pin', Icon: Pin, keywords: ['pin', 'bookmark'], universal: true },
  { name: 'archive', Icon: Archive, keywords: ['archive', 'history'], universal: true },
  { name: 'design', Icon: Palette, keywords: ['design', 'brand', 'theme'], universal: true },
  { name: 'power', Icon: Zap, keywords: ['power', 'fast', 'instant'], universal: true },
  { name: 'info', Icon: Info, keywords: ['info', 'about'], universal: true },
  { name: 'add', Icon: Plus, keywords: ['add', 'create', 'new'], universal: true },
  { name: 'grid', Icon: Grid2x2, keywords: ['grid', 'gallery', 'layout'], universal: true },
  { name: 'list', Icon: List, keywords: ['list', 'table', 'rows'], universal: true },
]

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'with',
  'my', 'our', 'your', 'is', 'are', 'app', 'tool', 'platform', 'service', 'site', 'saas',
])

function tokenize(prompt) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
}

function keywordInText(text, kw) {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|\\s|-)${escaped}($|\\s|-)`, 'i').test(` ${text} `)
}

function detectThemes(prompt) {
  return THEME_DETECTORS.filter(({ pattern }) => pattern.test(prompt)).map((t) => t.id)
}

function getPrimaryThemes(themes) {
  if (!themes.length) return []
  if (themes.includes('golf')) return ['golf', ...themes.filter((t) => t !== 'golf' && t !== 'productivity' && t !== 'dev')]
  return themes
}

function scoreIcon(def, tokens, fullText, primaryThemes) {
  let keywordScore = 0

  for (const kw of def.keywords) {
    if (keywordInText(fullText, kw)) keywordScore += kw.length >= 6 ? 5 : 4
    if (tokens.includes(kw)) keywordScore += 10
  }

  if (def.universal) return keywordScore >= 4 ? keywordScore : 0

  let themeScore = 0
  if (def.themes && keywordScore > 0) {
    for (const theme of primaryThemes) {
      if (def.themes.includes(theme)) themeScore += 12
    }
  }

  return keywordScore + themeScore
}

function hashPrompt(prompt) {
  let h = 0
  for (let i = 0; i < prompt.length; i++) h = (h * 31 + prompt.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededShuffle(arr, seed) {
  const out = [...arr]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Pick icons ranked by relevance to the user's prompt (local Lucide catalog).
 * @param {string} prompt
 * @param {number} count
 */
export function generateIconsFromCatalog(prompt, count, variant = 0) {
  const trimmed = prompt.trim()
  if (!trimmed) return []

  const fullText = trimmed.toLowerCase()
  const tokens = tokenize(trimmed)
  const themes = detectThemes(trimmed)
  const primaryThemes = getPrimaryThemes(themes)
  const seed = hashPrompt(trimmed) + variant * 9973

  const ranked = ICON_CATALOG.map((def) => ({
    ...def,
    score: scoreIcon(def, tokens, fullText, primaryThemes),
  }))

  ranked.sort((a, b) => b.score - a.score)

  const seen = new Set()
  const picked = []

  const pickFrom = (items, shuffleSeed) => {
    for (const item of seededShuffle(items, shuffleSeed)) {
      if (picked.length >= count) break
      if (seen.has(item.name)) continue
      seen.add(item.name)
      picked.push({ name: item.name, Icon: item.Icon })
    }
  }

  const highRelevance = ranked.filter((item) => item.score >= 4)
  pickFrom(
    highRelevance.length ? highRelevance : ranked.filter((i) => i.score > 0),
    seed,
  )

  if (picked.length < count && primaryThemes.length) {
    const themePool = ranked.filter(
      (item) => item.themes?.some((t) => primaryThemes.includes(t)) && !seen.has(item.name),
    )
    pickFrom(themePool, seed + 1)
  }

  if (picked.length < count) {
    const universal = ranked.filter((item) => item.universal && !seen.has(item.name))
    pickFrom(universal, seed + 2)
  }

  if (picked.length < count) {
    pickFrom(ranked.filter((item) => !seen.has(item.name)), seed + 3)
  }

  return picked.slice(0, count)
}
