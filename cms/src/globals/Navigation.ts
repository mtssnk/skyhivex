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

function navArrayField(name: string, label: string): Field {
  return {
    name,
    type: 'array',
    label,
    labels: { singular: 'Link', plural: 'Links' },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      ...linkFields(),
    ],
  }
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'header',
          label: 'Header',
          fields: [
            navArrayField('links', 'Navigation'),
            {
              type: 'collapsible',
              label: 'CTA Button',
              admin: {
                description: 'Optional call-to-action button shown at the end of the nav.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'button',
                  type: 'group',
                  label: false,
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
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          fields: [navArrayField('nav1', 'Navigation 1'), navArrayField('nav2', 'Navigation 2')],
        },
      ],
    },
  ],
}
