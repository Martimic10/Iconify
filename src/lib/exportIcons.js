import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import JSZip from 'jszip'
import { prepareNounSvg, isNounIcon } from './nounSvg'

const PNG_SIZES = [16, 32, 64, 128]

function strokeWidthForStyle(styleId) {
  switch (styleId) {
    case 'flat': return 0
    case 'bold': return 2.75
    case 'minimal': return 1
    case 'sketchy': return 2.5
    default: return 1.5
  }
}

function buildIconElement(Icon, { styleId, color, size }) {
  const strokeWidth = strokeWidthForStyle(styleId)
  const props = {
    size,
    strokeWidth,
    color: styleId === 'minimal' ? '#888888' : color,
    xmlns: 'http://www.w3.org/2000/svg',
  }

  if (styleId === 'flat') {
    props.fill = color
    props.color = color
  }
  if (styleId === 'duotone') {
    props.fill = `${color}33`
    props.color = color
  }

  return createElement(Icon, props)
}

function postProcessSvg(svg, { styleId, color }) {
  let out = svg

  if (styleId === 'gradient') {
    const gradId = `grad-${color.replace('#', '')}`
    const defs = `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#f4a261"/></linearGradient></defs>`
    out = out.replace('<svg', `<svg`).replace('>', `>${defs}`)
    out = out.replace(/stroke="currentColor"/g, `stroke="url(#${gradId})"`)
    out = out.replace(/stroke="#[^"]*"/g, `stroke="url(#${gradId})"`)
  }

  if (styleId === 'neon') {
    out = out.replace('<svg', `<svg style="filter:drop-shadow(0 0 6px ${color})"`)
  }

  if (styleId === 'rounded') {
    out = out.replace('<svg', `<svg stroke-linecap="round" stroke-linejoin="round"`)
  }

  return out
}

export function iconToSvg(icon, { styleId, color, size = 24 }) {
  if (isNounIcon(icon)) {
    return prepareNounSvg(icon.svg, { color, size, styleId })
  }
  const raw = renderToStaticMarkup(buildIconElement(icon.Icon, { styleId, color, size }))
  return postProcessSvg(raw, { styleId, color })
}

async function svgToPng(svgString, size) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(img, 0, 0, size, size)

    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  } finally {
    URL.revokeObjectURL(url)
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function safeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-|-$/g, '') || 'icon'
}

export async function downloadIconSvg(icon, { styleId, color }) {
  const svg = iconToSvg(icon, { styleId, color, size: 24 })
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, `${safeFilename(icon.name)}.svg`)
}

export async function buildIconSetZip(icons, { styleId, color, prompt = 'icon-set' }) {
  const zip = new JSZip()
  const folder = zip.folder('icons')
  const svgFolder = folder.folder('svg')
  const pngFolder = folder.folder('png')

  for (const icon of icons) {
    const base = safeFilename(icon.name)
    const svg = iconToSvg(icon, { styleId, color, size: 24 })
    svgFolder.file(`${base}.svg`, svg)

    for (const px of PNG_SIZES) {
      const sizedSvg = iconToSvg(icon, { styleId, color, size: px })
      const pngBlob = await svgToPng(sizedSvg, px)
      if (pngBlob) pngFolder.file(`${base}-${px}.png`, pngBlob)
    }
  }

  folder.file('README.txt', [
    'Iconify export',
    `Prompt: ${prompt}`,
    `Style: ${styleId}`,
    `Color: ${color}`,
    '',
    'Contents:',
    '- svg/   vector icons',
    '- png/   raster exports at 16, 32, 64, and 128px',
    '',
    'Attribution:',
    ...icons.filter((i) => i.attribution).map((i) => `- ${i.name}: ${i.attribution}`),
  ].join('\n'))

  const slug = safeFilename(prompt.slice(0, 40)) || 'icon-set'
  const filename = `${slug}-icons.zip`
  const blob = await zip.generateAsync({ type: 'blob' })
  return { blob, filename }
}

export async function downloadIconSetZip(icons, options) {
  const { blob, filename } = await buildIconSetZip(icons, options)
  downloadBlob(blob, filename)
}
