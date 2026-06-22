import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const MediaText: Block = {
  slug: 'mediaText',
  labels: { singular: 'Media + Text', plural: 'Media + Text Blocks' },
  fields: withBlockTabs(
    [
      {
        type: 'group',
        fields: [
          {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
          {
            name: 'mediaPosition',
            type: 'select',
            required: true,
            defaultValue: 'left',
            options: [
              { label: 'Media on left', value: 'left' },
              { label: 'Media on right', value: 'right' },
            ],
          },
          {
            name: 'aspectRatio',
            type: 'select',
            defaultValue: 'auto',
            options: [
              { label: 'Auto', value: 'auto' },
              { label: '16:9', value: '16/9' },
              { label: '4:3', value: '4/3' },
              { label: '1:1', value: '1/1' },
            ],
          },
        ],
      },
      {
        name: 'text',
        type: 'richText',
        required: true,
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'verticallyCentreText',
        label: 'Vertically Centre Text',
        defaultValue: false,
      },
    ],
  ),
}
