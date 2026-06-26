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

// export const headingStyleOptions = [
//   { label: 'Serif 5XL', value: 'text-serif-5xl' },
//   { label: 'Serif 2XL', value: 'text-serif-2xl' },
//   { label: 'Serif MD', value: 'text-serif-md' },
//   { label: 'Serif SM', value: 'text-serif-sm' },
//   { label: 'Extended 3XL', value: 'text-extended-3xl' },
//   { label: 'Extended 2XL', value: 'text-extended-2xl' },
//   { label: 'Extended XL Semibold', value: 'text-extended-xl-semibold' },
//   { label: 'Extended XL Light', value: 'text-extended-xl-light' },
//   { label: 'Extended LG', value: 'text-extended-lg' },
//   { label: 'Extended LG Light', value: 'text-extended-lg-light' },
//   { label: 'Extended MD', value: 'text-extended-md' },
//   { label: 'Extended 2XS', value: 'text-extended-2xs' },
// ]

// export const headingStyleField: Field = {
//   name: 'headingStyle',
//   type: 'select',
//   defaultValue: 'text-extended-lg',
//   options: headingStyleOptions,
// }

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
