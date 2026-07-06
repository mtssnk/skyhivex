import type { CollectionConfig, Field } from 'payload'

function linkFields(): Field[] {
  return [
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, sibling) => !sibling?.url,
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Custom URL',
      admin: {
        description: 'Use instead of Page for external or custom links.',
        condition: (_, sibling) => !sibling?.page,
      },
    },
  ]
}

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  labels: { singular: 'Navigation', plural: 'Navigations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description:
      'Curated navigation groups used in Linked Content blocks to cluster related pages.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        ...linkFields(),
      ],
    },
  ],
}
