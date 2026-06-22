import { GoogleTagManagerScripts } from './GoogleTagManagerScripts'
import { grantConsentForEverything, denyConsentForEverything } from './utils'
import { trackingConfig } from './config'
import { useEffect } from 'preact/hooks'

export const GoogleTracking = () => {
  useEffect(() => {
    const consent = window.astroConsent
    if (!consent) return

    const original = consent.set.bind(consent)
    consent.set = (categories) => {
      original(categories)
      if (categories.analytics) {
        grantConsentForEverything()
      } else {
        denyConsentForEverything()
      }
    }

    return () => {
      consent.set = original
    }
  }, [])

  if (!trackingConfig.gtmId) return null

  return <GoogleTagManagerScripts />
}
