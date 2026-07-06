import type { CollectionConfig } from 'payload'

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: { singular: 'City', plural: 'Cities' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'state', 'region'],
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
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      admin: {
        position: 'sidebar',
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
