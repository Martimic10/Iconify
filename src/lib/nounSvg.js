/**
 * Colorize and size Noun Project SVG markup for display/export.
 * @param {string} svg
 * @param {{ color?: string, size?: number, styleId?: string }} options
 */
export function prepareNounSvg(svg, { color = '#000000', size = 24, styleId = 'outline' } = {}) {
  if (!svg) return ''

  let out = svg.trim()
  const isFlat = styleId === 'flat' || styleId === 'bold' || styleId === 'duotone'
  const fillColor = styleId === 'duotone' ? `${color}33` : color
  const strokeColor = styleId === 'minimal' ? '#888888' : color

  out = out.replace(/\swidth="[^"]*"/i, '').replace(/\sheight="[^"]*"/i, '')
  out = out.replace(
    /<svg([^>]*)>/i,
    `<svg$1 width="${size}" height="${size}" role="img" aria-hidden="true">`,
  )

  if (isFlat) {
    out = out
      .replace(/fill="#000000"/gi, `fill="${fillColor}"`)
      .replace(/fill="#000"/gi, `fill="${fillColor}"`)
      .replace(/fill="black"/gi, `fill="${fillColor}"`)
      .replace(/stroke="#000000"/gi, `stroke="${strokeColor}"`)
      .replace(/stroke="#000"/gi, `stroke="${strokeColor}"`)
  } else {
    out = out
      .replace(/fill="#000000"/gi, isFlat ? `fill="${fillColor}"` : 'fill="none"')
      .replace(/fill="#000"/gi, isFlat ? `fill="${fillColor}"` : 'fill="none"')
      .replace(/fill="black"/gi, isFlat ? `fill="${fillColor}"` : 'fill="none"')
      .replace(/stroke="#000000"/gi, `stroke="${strokeColor}"`)
      .replace(/stroke="#000"/gi, `stroke="${strokeColor}"`)
      .replace(/stroke="black"/gi, `stroke="${strokeColor}"`)
  }

  if (styleId === 'rounded') {
    out = out.replace('<svg', '<svg stroke-linecap="round" stroke-linejoin="round"')
  }

  if (styleId === 'gradient') {
    const gradId = `noun-grad-${color.replace('#', '')}`
    const defs = `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#f4a261"/></linearGradient></defs>`
    out = out.replace(/<svg([^>]*)>/, `<svg$1>${defs}`)
    out = out.replace(new RegExp(`stroke="${strokeColor}"`, 'g'), `stroke="url(#${gradId})"`)
    out = out.replace(new RegExp(`fill="${fillColor}"`, 'g'), `fill="url(#${gradId})"`)
  }

  if (styleId === 'neon') {
    out = out.replace('<svg', `<svg style="filter:drop-shadow(0 0 6px ${color})"`)
  }

  return out
}

export function isNounIcon(icon) {
  return Boolean(icon?.svg || icon?.source === 'noun')
}
