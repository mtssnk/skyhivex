import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (secret !== import.meta.env.PREVIEW_SECRET || !slug) {
    return new Response('Invalid preview request', { status: 401 })
  }

  cookies.set('__preview', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
  })

  const destination = slug === 'home' ? '/' : `/${slug}`
  return redirect(destination)
}
