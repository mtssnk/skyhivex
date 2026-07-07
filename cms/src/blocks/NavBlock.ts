import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const NavBlock: Block = {
  slug: 'navBlock',
  labels: { singular: 'Navigation', plural: 'Navigations' },
  fields: withBlockTabs(
    [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'links',
        type: 'array',
        fields: [
          {
            name: 'label',
            type: 'text',
            required: true,
          },
          {
            name: 'page',
            type: 'relationship',
            relationTo: ['pages', 'projects', 'posts'],
            admin: {
              condition: (_, sibling) => !sibling?.url,
            },
          },
          {
            name: 'url',
            type: 'text',
            label: 'Custom URL',
            admin: {
              description: 'Used when no page is selected.',
              condition: (_, sibling) => !sibling?.page,
            },
          },
        ],
      },
    ],
    { padding: false },
  ),
}
