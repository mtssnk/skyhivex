import type { CollectionConfig } from 'payload'

export const SVGs: CollectionConfig = {
  slug: 'svgs',
  labels: { singular: 'SVG', plural: 'SVGs' },
  admin: {
    useAsTitle: 'name',
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
      name: 'code',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Paste raw SVG markup here. Use fill="currentColor" on any fill attributes so the colour can be controlled via CSS.',
      },
    },
  ],
}
