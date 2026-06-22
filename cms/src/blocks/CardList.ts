import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const CardList: Block = {
  slug: 'cardList',
  labels: { singular: 'Card List', plural: 'Card Lists' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'relationship',
          relationTo: 'svgs',
          hasMany: false,
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ]),
}
