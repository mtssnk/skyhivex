import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)
const toEmail = import.meta.env.CONTACT_EMAIL as string

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>

  try {
    body = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }

  const { name, email, phone, message } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(null, { status: 422 })
  }

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM ?? 'Snook Studio <onboarding@resend.dev>',
    to: toEmail,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, ``, message]
      .filter((l) => l !== null)
      .join('\n'),
  })

  if (error) {
    console.error('Resend error:', error)
    return new Response(null, { status: 500 })
  }

  return new Response(null, { status: 200 })
}
