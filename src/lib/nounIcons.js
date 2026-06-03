const API_BASE = import.meta.env.VITE_API_BASE || ''

/**
 * @param {{ prompt: string, count: number, styleId?: string, variant?: number, iconIds?: string[] }} params
 */
export async function fetchNounIcons(params) {
  const res = await fetch(`${API_BASE}/api/noun-icons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (res.status === 503) {
    return { icons: [], source: 'unconfigured' }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch icons from Noun Project')
  }

  return res.json()
}
