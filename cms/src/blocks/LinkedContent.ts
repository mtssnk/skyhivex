import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const LinkedContent: Block = {
  slug: 'linkedContent',
  labels: { singular: 'Linked Content', plural: 'Linked Content' },
  fields: withBlockTabs([
    {
      name: 'navigation',
      type: 'relationship',
      relationTo: 'navigations',
      required: true,
      admin: {
        description: 'Select a navigation group to display as linked related content.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
      admin: {
        description: 'Optional introductory text displayed above the navigation links.',
      },
    },
  ]),
}
