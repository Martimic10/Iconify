import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import { buildIconPlan, scoreNounIcon, tokenize } from './iconPlan.js'
import { mapStyleToNounStyles } from './promptQueries.js'

const API_BASE = 'https://api.thenounproject.com'

let oauthClient

function getOAuth() {
  const key = process.env.NOUN_PROJECT_API_KEY
  const secret = process.env.NOUN_PROJECT_API_SECRET
  if (!key || !secret) return null

  if (!oauthClient) {
    oauthClient = OAuth({
      consumer: { key, secret },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      },
    })
  }

  return { oauth: oauthClient, key, secret }
}

export function isNounProjectConfigured() {
  return Boolean(process.env.NOUN_PROJECT_API_KEY && process.env.NOUN_PROJECT_API_SECRET)
}

async function signedFetch(url, { method = 'GET' } = {}) {
  const auth = getOAuth()
  if (!auth) throw new Error('Noun Project API is not configured')

  const requestData = { url, method }
  const headers = auth.oauth.toHeader(auth.oauth.authorize(requestData))

  const res = await fetch(url, {
    method,
    headers: { ...headers, Accept: 'application/json' },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Noun Project API error (${res.status}): ${text.slice(0, 200)}`)
  }

  return res.json()
}

async function searchIcons(query, { styles, limit = 12 }) {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    thumbnail_size: '84',
    blacklist: '1',
  })
  if (styles) params.set('styles', styles)

  const url = `${API_BASE}/v2/icon?${params.toString()}`
  const data = await signedFetch(url)
  return data.icons || []
}

async function getIconAsset(iconId) {
  const url = `${API_BASE}/v2/icon/${iconId}?thumbnail_size=84`
  const data = await signedFetch(url)
  const iconUrl = data.icon?.icon_url
  if (!iconUrl) return null

  const svgRes = await fetch(iconUrl)
  if (!svgRes.ok) return null
  return svgRes.text()
}

async function mapWithConcurrency(items, limit, fn) {
  const results = []
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i], i)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/**
 * @param {{ prompt: string, count: number, styleId?: string, variant?: number, iconIds?: string[] }} options
 */
export async function generateNounIcons({ prompt, count, styleId = 'outline', variant = 0, iconIds = [] }) {
  if (!isNounProjectConfigured()) {
    return { icons: [], source: 'unconfigured' }
  }

  const styles = mapStyleToNounStyles(styleId)
  const tokens = tokenize(prompt)
  const seen = new Set()
  const ranked = []

  if (iconIds.length) {
    for (const id of iconIds) {
      ranked.push({
        id: String(id),
        term: `icon-${id}`,
        attribution: '',
        tags: [],
        score: 100,
        slotLabel: `icon-${id}`,
      })
    }
  } else {
    const plan = buildIconPlan(prompt, count)
    const planOffset = variant % Math.max(plan.length, 1)

    for (let i = 0; i < plan.length; i++) {
      const slot = plan[(i + planOffset) % plan.length]
      try {
        const results = await searchIcons(slot.searchQuery, { styles, limit: 8 })
        for (const icon of results) {
          const id = String(icon.id)
          if (seen.has(id)) continue
          const score = scoreNounIcon(icon, { prompt, slot, tokens })
          if (score < 8) continue
          seen.add(id)
          ranked.push({
            id,
            term: icon.term,
            attribution: icon.attribution || '',
            tags: icon.tags || [],
            score,
            slotLabel: slot.label,
          })
        }
      } catch (err) {
        console.error(`Noun search failed for "${slot.searchQuery}":`, err.message)
      }
    }

    if (ranked.length < count) {
      const fallbackQuery = tokens.slice(0, 4).join(' ') || prompt.slice(0, 40)
      try {
        const results = await searchIcons(fallbackQuery, { styles, limit: count * 2 })
        for (const icon of results) {
          const id = String(icon.id)
          if (seen.has(id)) continue
          const score = scoreNounIcon(icon, { prompt, slot: null, tokens })
          if (score < 4) continue
          seen.add(id)
          ranked.push({
            id,
            term: icon.term,
            attribution: icon.attribution || '',
            tags: icon.tags || [],
            score,
            slotLabel: slugify(icon.term, id),
          })
        }
      } catch (err) {
        console.error('Noun fallback search failed:', err.message)
      }
    }
  }

  ranked.sort((a, b) => b.score - a.score)
  const picked = ranked.slice(0, count)

  const icons = await mapWithConcurrency(picked, 8, async (candidate) => {
    try {
      const svg = await getIconAsset(candidate.id)
      if (!svg) return null
      return {
        name: candidate.slotLabel || slugify(candidate.term, candidate.id),
        term: candidate.term,
        nounId: candidate.id,
        svg,
        attribution: candidate.attribution,
        source: 'noun',
      }
    } catch {
      return null
    }
  })

  return {
    icons: icons.filter(Boolean),
    source: 'noun',
  }
}

function slugify(term, id) {
  return String(term || 'icon')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `icon-${id}`
}
