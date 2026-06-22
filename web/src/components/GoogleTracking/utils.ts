import { IS_GTM_ENABLED, trackingConfig } from './config'
import type { GtagEvent } from './types'

const logGAWarning = (message: string) => {
  console.warn(message)
}

const getGtag = () => {
  if (!IS_GTM_ENABLED) {
    logGAWarning('Google Tag Manager is not enabled')
    return null
  }
  if (!window.gtag) {
    logGAWarning(`GTM gtag does not exist yet`)
    return null // Don't throw error, just return null
  }
  return window.gtag
}

export const sendGAEvent = (event: GtagEvent) => {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
  })
}

export const grantConsentForEverything = () => {
  const gtag = getGtag()
  if (!gtag) return
  gtag('consent', 'update', {
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    ad_storage: 'granted',
    analytics_storage: 'granted',
  })
}

export const denyConsentForEverything = () => {
  const gtag = getGtag()
  if (!gtag) return
  gtag('consent', 'update', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: 'denied',
  })
}

export const markFeatureUsage = (feature: string) => {
  performance.mark('mark_feature_usage', {
    detail: { feature },
  })
}

export const pageview = (url: string) => {
  const gtag = getGtag()
  if (!gtag || !trackingConfig.gtmId) return

  gtag('config', trackingConfig.gtmId, {
    page_path: url,
  })
}
