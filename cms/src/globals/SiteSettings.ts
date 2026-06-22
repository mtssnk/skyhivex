import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactName',
      type: 'text',
      label: 'Contact Name',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo',
      relationTo: 'media',
      admin: {
        description: 'Used in structured data (JSON-LD). Separate from the favicon.',
      },
    },
    {
      name: 'adobeFontsId',
      type: 'text',
      label: 'Adobe Fonts Kit ID',
      admin: {
        description: 'The kit ID from use.typekit.net — e.g. "qzh8ztg". Leave blank to disable.',
      },
    },
    {
      name: 'allowIndexing',
      type: 'checkbox',
      label: 'Allow search engine indexing',
      defaultValue: false,
      admin: {
        description:
          'When unchecked, a noindex meta tag and a blocking robots.txt are served. Enable only when the site is ready to go public.',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
