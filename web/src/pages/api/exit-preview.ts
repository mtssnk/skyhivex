import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('__preview', { path: '/' })
  return redirect('/')
}
