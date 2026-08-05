import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  imageURL: '/assets/block-thumbnails/quote-preview.jpg',
  fields: withBlockTabs([
    {
      name: 'quoteSize',
      type: 'select',
      required: true,
      defaultValue: 'regular',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Regular', value: 'regular' },
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
