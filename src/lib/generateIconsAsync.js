import { generateIconsFromCatalog } from './generateIcons'
import { fetchNounIcons } from './nounIcons'

/**
 * Generate icons from Noun Project when configured, with Lucide catalog fallback.
 * @param {string} prompt
 * @param {number} count
 * @param {number} variant
 * @param {string} styleId
 * @param {string[]} [iconIds]
 */
export async function generateIconsFromPrompt(prompt, count, variant = 0, styleId = 'outline', iconIds = []) {
  const trimmed = prompt.trim()
  if (!trimmed && !iconIds.length) return []

  if (iconIds.length) {
    try {
      const rehydrated = await fetchNounIcons({
        prompt: trimmed,
        count: iconIds.length,
        styleId,
        variant,
        iconIds,
      })
      if (rehydrated.icons?.length) return rehydrated.icons
    } catch {
      /* fall through */
    }
  }

  try {
    const nounResult = await fetchNounIcons({ prompt: trimmed, count, styleId, variant })
    if (nounResult.icons?.length) {
      if (nounResult.icons.length >= count) {
        return nounResult.icons.slice(0, count)
      }

      const fallback = generateIconsFromCatalog(trimmed, count - nounResult.icons.length, variant + 500)
      const seen = new Set(nounResult.icons.map((icon) => icon.name))
      const merged = [...nounResult.icons]
      for (const icon of fallback) {
        if (merged.length >= count) break
        if (seen.has(icon.name)) continue
        seen.add(icon.name)
        merged.push({ ...icon, source: 'lucide' })
      }
      return merged.slice(0, count)
    }
  } catch (err) {
    console.warn('Noun Project unavailable, using local catalog:', err.message)
  }

  return generateIconsFromCatalog(trimmed, count, variant).map((icon) => ({
    ...icon,
    source: 'lucide',
  }))
}

export { generateIconsFromCatalog } from './generateIcons'
