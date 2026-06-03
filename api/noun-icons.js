import { generateNounIcons, isNounProjectConfigured } from './_lib/nounProject.js'
import { badRequest, json, methodNotAllowed, readJsonBody, serverError, setCors } from './_lib/http.js'

export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') return methodNotAllowed(res)

  if (!isNounProjectConfigured()) {
    json(res, 503, { error: 'Noun Project API is not configured', icons: [], source: 'unconfigured' })
    return
  }

  try {
    const body = await readJsonBody(req)
    const { prompt, count = 6, styleId = 'outline', variant = 0, iconIds = [] } = body

    if (iconIds?.length) {
      const result = await generateNounIcons({ prompt: prompt || '', count: iconIds.length, styleId, variant, iconIds })
      json(res, 200, result)
      return
    }

    if (!prompt || !String(prompt).trim()) {
      return badRequest(res, 'prompt is required')
    }

    const iconCount = Math.min(Math.max(Number(count) || 6, 1), 100)
    const result = await generateNounIcons({
      prompt: String(prompt).trim(),
      count: iconCount,
      styleId: String(styleId),
      variant: Number(variant) || 0,
    })

    json(res, 200, result)
  } catch (err) {
    console.error('noun-icons:', err)
    serverError(res, err.message || 'Failed to fetch Noun Project icons')
  }
}
