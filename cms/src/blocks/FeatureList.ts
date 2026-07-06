import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const FeatureList: Block = {
  slug: 'featureList',
  labels: { singular: 'Feature List', plural: 'Feature Lists' },
  fields: withBlockTabs(
    [
      {
        name: 'heading',
        type: 'text',
      },
      {
        name: 'headingTag',
        type: 'select',
        defaultValue: 'h2',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' },
        ],
      },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        maxRows: 3,
        fields: [
          {
            name: 'icon',
            type: 'relationship',
            relationTo: 'svgs',
          },
          {
            name: 'heading',
            type: 'text',
            required: true,
          },
          {
            name: 'body',
            type: 'textarea',
          },
        ],
      },
      {
        name: 'linkLabel',
        type: 'text',
      },
      {
        name: 'linkType',
        type: 'select',
        defaultValue: 'internal',
        options: [
          { label: 'Page', value: 'internal' },
          { label: 'External URL', value: 'external' },
        ],
        admin: {
          condition: (_, sibling) => Boolean(sibling?.linkLabel),
        },
      },
      {
        name: 'linkUrl',
        type: 'text',
        admin: {
          condition: (_, sibling) =>
            Boolean(sibling?.linkLabel) && sibling?.linkType !== 'internal',
        },
      },
      {
        name: 'linkPage',
        type: 'relationship',
        relationTo: ['pages', 'projects', 'posts'],
        admin: {
          condition: (_, sibling) =>
            Boolean(sibling?.linkLabel) && sibling?.linkType === 'internal',
        },
      },
    ],
    { padding: false },
  ),
}
