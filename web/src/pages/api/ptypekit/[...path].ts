import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path
  const requestUrl = new URL(request.url)
  const targetUrl = new URL(`https://p.typekit.net/${path}`)
  requestUrl.searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value))

  let response: Response
  try {
    response = await fetch(targetUrl.toString(), {
      headers: { 'User-Agent': request.headers.get('User-Agent') ?? 'Mozilla/5.0' },
    })
  } catch {
    return new Response(null, { status: 502 })
  }

  let css = await response.text()
  css = css
    .replace(/https:\/\/use\.typekit\.net\//g, '/api/typekit/')
    .replace(/https:\/\/p\.typekit\.net\//g, '/api/ptypekit/')

  return new Response(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
