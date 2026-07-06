import type { Field } from 'payload'
import { slugifyAnchor } from '../../lib/slugify'

const anchorField: Field = {
  name: 'anchorId',
  type: 'text',
  label: 'Anchor ID',
  admin: {
    description:
      'Optional scroll target (e.g. "contact" → #contact). Spaces and special characters are removed automatically.',
  },
  hooks: {
    beforeChange: [({ value }) => (value ? slugifyAnchor(value as string) : value)],
  },
}

const paddingFields: Field[] = [
  {
    name: 'paddingWhere',
    type: 'select',
    defaultValue: 'both',
    admin: {
      description: 'Which side(s) the vertical padding is applied to.',
    },
    options: [
      { label: 'Top & bottom', value: 'both' },
      { label: 'Top only', value: 'top' },
      { label: 'Bottom only', value: 'bottom' },
    ],
  },
  {
    name: 'paddingSize',
    type: 'select',
    defaultValue: 'md',
    admin: {
      description: 'Size of the vertical padding.',
    },
    options: [
      { label: 'XL', value: 'xl' },
      { label: 'Large', value: 'lg' },
      { label: 'Medium', value: 'md' },
      { label: 'Small', value: 'sm' },
    ],
  },
]

type BlockTabsOptions = {
  padding?: boolean
  extra?: Field[]
}

export const withBlockTabs = (
  contentFields: Field[],
  { padding = true, extra = [] }: BlockTabsOptions = {},
): Field[] => [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Content',
        fields: contentFields,
      },
      {
        label: 'Options',
        fields: [anchorField, ...(padding ? paddingFields : []), ...extra],
      },
    ],
  },
]
