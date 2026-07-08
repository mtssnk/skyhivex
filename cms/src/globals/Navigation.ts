import type { Field, GlobalConfig } from 'payload'

function linkFields(withDropdown = false): Field[] {
  return [
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Page', value: 'page' },
        { label: 'Projects listing', value: 'projects' },
        { label: 'News listing', value: 'news' },
        { label: 'Custom URL', value: 'url' },
        ...(withDropdown ? [{ label: 'Dropdown', value: 'dropdown' }] : []),
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

function navArrayField(name: string, label: string, withChildren = false): Field {
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
      ...linkFields(withChildren),
      ...(withChildren
        ? [
            {
              name: 'children',
              type: 'array',
              label: 'Dropdown children',
              labels: { singular: 'Child link', plural: 'Child links' },
              admin: {
                condition: (_data: Record<string, unknown>, siblingData: Record<string, unknown>) =>
                  siblingData?.type === 'dropdown',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                ...linkFields(),
              ],
            } as Field,
          ]
        : []),
    ],
  }
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Site Navigation',
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
            navArrayField('links', 'Navigation', true),
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
