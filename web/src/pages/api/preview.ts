import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (secret !== import.meta.env.PREVIEW_SECRET || !slug) {
    return new Response('Invalid preview request', { status: 401 })
  }

  cookies.set('__preview', 'true', {
    path: '/',
    httpOnly: true,
    // 'strict' would exclude this cookie from the very redirect that sets it, since the
    // navigation originates cross-site (Preview is clicked from the CMS's own origin).
    // 'lax' still blocks cross-site POSTs/subresource requests but allows top-level GET
    // navigations like this one.
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  })

  const destination = slug === 'home' ? '/preview' : `/preview/${slug}`
  const response = redirect(destination)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
