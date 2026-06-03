import { prepareNounSvg } from '../lib/nounSvg'

export default function NounIcon({ svg, color, size = 24, styleId = 'outline', className = '' }) {
  if (!svg) return null

  const markup = prepareNounSvg(svg, { color, size, styleId })

  return (
    <span
      className={`noun-icon ${className}`.trim()}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
