import type { CollectionConfig } from 'payload'

export const States: CollectionConfig = {
  slug: 'states',
  labels: { singular: 'State', plural: 'States' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'region'],
    group: 'Categories',
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name. Do not change after publishing.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.name || ''
            return source
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          },
        ],
      },
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
