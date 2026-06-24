import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path
  const requestUrl = new URL(request.url)
  const targetUrl = new URL(`https://use.typekit.net/${path}`)
  requestUrl.searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value))

  let response: Response
  try {
    response = await fetch(targetUrl.toString(), {
      headers: { 'User-Agent': request.headers.get('User-Agent') ?? 'Mozilla/5.0' },
    })
  } catch {
    return new Response(null, { status: 502 })
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('css') || path?.endsWith('.css')) {
    let css = await response.text()
    css = css
      .replace(/https:\/\/use\.typekit\.net\//g, '/api/typekit/')
      .replace(/https:\/\/p\.typekit\.net\//g, '/api/ptypekit/')
    return new Response(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  // Font binary files
  const buffer = await response.arrayBuffer()
  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
