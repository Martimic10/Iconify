export const FREE_ICON_LIMIT = 6

export const ICON_COUNTS = [6, 12, 24, 36, 100]

export const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    icons: 12,
    perIcon: '$0.42 per icon',
    audience: 'For solo makers getting started',
    features: ['12 custom icons', '4 export sizes', 'SVG + PNG', 'Commercial license', 'Email delivery'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 13,
    icons: 36,
    perIcon: '$0.36 per icon',
    audience: 'For indie devs & small teams',
    features: ['36 custom icons', 'All export sizes', 'SVG + PNG', 'Commercial license', 'Priority delivery', '3 style variations', 'Custom color palette'],
    popular: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 27,
    icons: 100,
    perIcon: '$0.27 per icon',
    audience: 'For agencies & large products',
    features: ['100 custom icons', 'All export sizes', 'SVG + PNG + WebP', 'Commercial license', 'Priority delivery', 'All style variations', 'Custom color palette', 'Brand kit included'],
    popular: false,
  },
]

export function getPackForCount(count) {
  if (count <= FREE_ICON_LIMIT) return null
  if (count <= 12) return 'starter'
  if (count <= 36) return 'pro'
  return 'studio'
}

export function getPackById(id) {
  return PACKS.find((p) => p.id === id)
}

export function maxIconsUnlocked(unlockedPackId) {
  if (!unlockedPackId) return FREE_ICON_LIMIT
  return getPackById(unlockedPackId)?.icons ?? FREE_ICON_LIMIT
}

export function isCountFree(count) {
  return count <= FREE_ICON_LIMIT
}

export function needsUpgrade(count, unlockedMax) {
  return count > unlockedMax
}
