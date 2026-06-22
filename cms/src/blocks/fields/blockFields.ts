import type { Field } from 'payload'
import { slugifyAnchor } from '../../lib/slugify'

const optionsFields: Field[] = [
  {
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
  },
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
    defaultValue: 'lg',
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

export const withBlockTabs = (
  contentFields: Field[],
  extraOptionsFields: Field[] = [],
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
        fields: [...optionsFields, ...extraOptionsFields],
      },
    ],
  },
]
