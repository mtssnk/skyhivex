import type { Field, GlobalConfig } from 'payload'

function linkFields(): Field[] {
  return [
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Page', value: 'page' },
        { label: 'Projects listing', value: 'projects' },
        { label: 'News listing', value: 'news' },
        { label: 'Custom URL', value: 'url' },
      ],
      defaultValue: 'page',
      required: true,
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'page',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'url',
      },
    },
  ]
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      label: 'Nav Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        ...linkFields(),
      ],
    },
    {
      name: 'button',
      type: 'group',
      label: 'CTA Button',
      admin: {
        description: 'Optional call-to-action button shown at the end of the nav.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
        },
        ...linkFields(),
      ],
    },
  ],
}
