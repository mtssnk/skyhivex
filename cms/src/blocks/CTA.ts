import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'
import { heroFields, heroSizeField } from './Hero'
import { headingTagField } from '../fields/headingTag'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  imageURL: '/assets/block-thumbnails/cta-preview.jpg',
  fields: withBlockTabs(heroFields, {
    padding: false,
    extra: [heroSizeField, headingTagField({ defaultValue: 'h2' })],
  }),
}
