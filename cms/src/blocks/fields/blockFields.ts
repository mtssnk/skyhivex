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

type PaddingWhere = 'both' | 'top' | 'bottom' | 'none'
type PaddingSize = 'xl' | 'lg' | 'md' | 'sm'

function makePaddingFields(where: PaddingWhere = 'both', size: PaddingSize = 'md'): Field[] {
  return [
    {
      name: 'paddingWhere',
      type: 'select',
      defaultValue: where,
      admin: {
        description: 'Which side(s) the vertical padding is applied to.',
      },
      options: [
        { label: 'Top & bottom', value: 'both' },
        { label: 'Top only', value: 'top' },
        { label: 'Bottom only', value: 'bottom' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'paddingSize',
      type: 'select',
      defaultValue: size,
      admin: {
        description: 'Size of the vertical padding.',
        condition: (_, sibling) => sibling?.paddingWhere !== 'none',
      },
      options: [
        { label: 'XL', value: 'xl' },
        { label: 'Large', value: 'lg' },
        { label: 'Medium', value: 'md' },
        { label: 'Small', value: 'sm' },
      ],
    },
  ]
}

type BlockTabsOptions = {
  padding?: boolean
  paddingDefaults?: {
    where?: PaddingWhere
    size?: PaddingSize
  }
  extra?: Field[]
}

export const withBlockTabs = (
  contentFields: Field[],
  { padding = true, paddingDefaults, extra = [] }: BlockTabsOptions = {},
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
        fields: [
          anchorField,
          ...(padding ? makePaddingFields(paddingDefaults?.where, paddingDefaults?.size) : []),
          ...extra,
        ],
      },
    ],
  },
]
