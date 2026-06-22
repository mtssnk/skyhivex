import type { APIRoute } from 'astro'
import { getSiteSettings } from '@/lib/payload'

export const GET: APIRoute = async () => {
  const settings = await getSiteSettings()
  const allow = settings?.allowIndexing === true

  const body = allow ? `User-agent: *\nAllow: /\n` : `User-agent: *\nDisallow: /\n`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
