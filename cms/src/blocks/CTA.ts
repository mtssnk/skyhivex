import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'
import { heroFields } from './Hero'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: withBlockTabs(heroFields),
}
