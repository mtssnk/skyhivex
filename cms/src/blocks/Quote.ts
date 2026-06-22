import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: withBlockTabs([
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
    },
  ]),
}
