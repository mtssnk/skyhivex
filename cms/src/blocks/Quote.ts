import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: withBlockTabs([
    {
      name: 'quoteStyle',
      type: 'select',
      required: true,
      defaultValue: 'default',
      admin: {
        description: 'Visual style for the quote. Confirm final options from Figma.',
      },
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'large' },
      ],
    },
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
