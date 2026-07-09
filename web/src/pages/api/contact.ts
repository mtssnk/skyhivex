import type { APIRoute } from 'astro'
import { Resend } from 'resend'

export const prerender = false

const resend = new Resend(import.meta.env.RESEND_API_KEY)
const toEmail = import.meta.env.CONTACT_EMAIL as string
const MIN_SUBMIT_MS = 4000

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }

  const { name, email, phone, location, message, website, elapsedMs } = body as Record<
    string,
    string
  > & { elapsedMs?: number }

  // Honeypot + minimum-fill-time check: bots either fill the hidden field or
  // submit faster than a human can. Fake a 200 so they don't adapt and retry.
  if (website?.trim() || typeof elapsedMs !== 'number' || elapsedMs < MIN_SUBMIT_MS) {
    return new Response(null, { status: 200 })
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(null, { status: 422 })
  }

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM ?? 'Snook Studio <onboarding@resend.dev>',
    to: toEmail,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      location ? `Location: ${location}` : null,
      ``,
      message,
    ]
      .filter((l) => l !== null)
      .join('\n'),
  })

  if (error) {
    console.error('Resend error:', error)
    return new Response(null, { status: 500 })
  }

  return new Response(null, { status: 200 })
}
