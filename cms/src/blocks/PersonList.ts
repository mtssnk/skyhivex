import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const PersonList: Block = {
  slug: 'personList',
  labels: { singular: 'Person List', plural: 'Person Lists' },
  fields: withBlockTabs(
    [
      {
        name: 'heading',
        type: 'text',
      },
      {
        name: 'body',
        type: 'richText',
      },
      {
        name: 'people',
        type: 'array',
        required: true,
        minRows: 1,
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
          {
            name: 'cutoutImage',
            type: 'checkbox',
            label: 'Cut out image',
            defaultValue: true,
          },
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'role',
            type: 'text',
          },
          {
            name: 'description',
            type: 'textarea',
          },
        ],
      },
    ],
    { padding: false },
  ),
}
