import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const AccordionList: Block = {
  slug: 'accordionList',
  labels: { singular: 'Accordion List', plural: 'Accordion Lists' },
  imageURL: '/assets/block-thumbnails/accordion-list-preview.jpg',
  fields: withBlockTabs(
    [
      {
        name: 'items',
        type: 'array',
        required: true,
        minRows: 1,
        fields: [
          {
            name: 'heading',
            type: 'text',
            required: true,
            admin: {
              description: 'Acts as the toggle trigger.',
            },
          },
          {
            name: 'body',
            type: 'richText',
            required: true,
          },
        ],
      },
    ],
    { padding: false },
  ),
}
