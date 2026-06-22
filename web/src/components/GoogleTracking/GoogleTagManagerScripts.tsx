import { trackingConfig } from './config'
import { useEffect } from 'preact/hooks'

export function GoogleTagManagerScripts() {
  useEffect(() => {
    if (!trackingConfig.gtmId) return

    const w = window as unknown as Record<string, unknown>
    w['dataLayer'] = w['dataLayer'] || []
    ;(w['dataLayer'] as unknown[]).push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${trackingConfig.gtmId}`
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  if (!trackingConfig.gtmId) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
