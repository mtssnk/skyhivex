// @ts-check
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'
import preact from '@astrojs/preact'
import astroConsent from 'astro-consent'

export default defineConfig({
  output: 'server',
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',

  adapter: node({
    mode: 'standalone',
  }),

  server: {
    host: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    preact({ compat: true }),
    astroConsent({
      siteName: 'SkyHive X',
      headline: 'Cookie preferences',
      description:
        'We use cookies to enhance your experience and for marketing. Do you consent to the use of these cookies?',
      acceptLabel: 'Accept',
      rejectLabel: 'Decline',
      presentation: 'banner',
      manageLabel: '',
      displayUntilIdle: true,
      displayIdleDelayMs: 1500,
      consent: { days: 365, storageKey: 'astro-consent' },
    }),
  ],
})
