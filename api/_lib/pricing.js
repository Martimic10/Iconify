export const PACKS = {
  starter: { id: 'starter', name: 'Starter', price: 5, icons: 12 },
  pro: { id: 'pro', name: 'Pro', price: 13, icons: 36 },
  studio: { id: 'studio', name: 'Studio', price: 27, icons: 100 },
}

export function getPackById(id) {
  return PACKS[id] || null
}
