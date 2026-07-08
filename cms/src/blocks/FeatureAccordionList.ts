import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const FeatureAccordionList: Block = {
  slug: 'featureAccordionList',
  labels: { singular: 'Feature Accordion List', plural: 'Feature Accordion Lists' },
  fields: withBlockTabs(
    [
      {
        name: 'features',
        type: 'array',
        required: true,
        minRows: 1,
        fields: [
          {
            name: 'icon',
            type: 'relationship',
            relationTo: 'svgs',
            required: true,
          },
          {
            name: 'heading',
            type: 'text',
            required: true,
          },
          {
            name: 'intro',
            type: 'textarea',
            required: true,
          },
          {
            name: 'body',
            type: 'richText',
          },
        ],
      },
    ],
    { padding: false },
  ),
}
