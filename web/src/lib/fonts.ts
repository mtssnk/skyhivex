const CACHE_TTL = 3_600_000 // 1 hour

let cache: { css: string; kitId: string; expiresAt: number } | null = null

const BROWSER_HEADERS = {
  Accept: 'text/css,*/*;q=0.1',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
}

// Adobe's servers serve slug names (acumin-pro) to non-browser clients but
// title-case names (Acumin Pro) to real browsers. Convert to title case so
// @font-face declarations match the CSS custom properties in global.css.
function slugToTitle(slug: string): string {
  return (
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-./g, (m) => ' ' + m[1].toUpperCase())
  )
}

async function fetchText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS })
    if (!res.ok) return ''
    return res.text()
  } catch {
    return ''
  }
}

export async function getAdobeFontsCss(kitId: string): Promise<string> {
  if (cache && cache.kitId === kitId && Date.now() < cache.expiresAt) {
    return cache.css
  }

  const kitCss = await fetchText(`https://use.typekit.net/${kitId}.css`)
  if (!kitCss) return ''

  // Follow @import for p.typekit.net to pull @font-face rules server-side
  const importMatch = kitCss.match(
    /@import\s+url\(["']?(https:\/\/p\.typekit\.net\/[^"')]+)["']?\)\s*;?/,
  )

  let combined = kitCss
  if (importMatch) {
    const pCss = await fetchText(importMatch[1])
    if (pCss) {
      combined = kitCss.replace(importMatch[0], pCss)
    }
  }

  const processed = combined
    .replace(/https:\/\/use\.typekit\.net\/af\//g, '/api/typekit/af/')
    .replace(/https:\/\/p\.typekit\.net\//g, '/api/ptypekit/')
    .replace(/font-family:"([a-z][a-z0-9-]*)"/g, (_, name) => `font-family:"${slugToTitle(name)}"`)

  cache = { css: processed, kitId, expiresAt: Date.now() + CACHE_TTL }
  return processed
}
