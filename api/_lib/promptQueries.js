const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'with',
  'my', 'our', 'your', 'is', 'are', 'app', 'tool', 'platform', 'service', 'site', 'saas',
  'create', 'icons', 'icon', 'make', 'build',
])

import { buildIconPlan } from './iconPlan.js'

export function buildSearchQueries(prompt, variant = 0) {
  const plan = buildIconPlan(prompt, 20)
  if (!plan.length) return [prompt.trim().slice(0, 60)].filter(Boolean)
  const offset = variant % plan.length
  return [...plan.slice(offset), ...plan.slice(0, offset)].map((slot) => slot.searchQuery)
}

export function mapStyleToNounStyles(styleId) {
  switch (styleId) {
    case 'flat':
    case 'bold':
    case 'duotone':
      return 'solid'
    case 'outline':
    case 'minimal':
    case 'rounded':
    case 'sketchy':
    case 'glass':
    case 'neon':
    case 'gradient':
      return 'line'
    case 'pixel':
    case '3d':
      return 'line,solid'
    default:
      return 'line,solid'
  }
}

export { hashPrompt, seededShuffle, tokenize } from './iconPlan.js'
