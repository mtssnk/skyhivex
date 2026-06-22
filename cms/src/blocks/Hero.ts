import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: withBlockTabs([
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Full-bleed background image or video behind the hero content.',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      required: false,
    },
    {
      name: 'buttons',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'page',
          options: [
            { label: 'Page link', value: 'page' },
            { label: 'Scroll to section', value: 'scroll' },
            { label: 'Open video', value: 'video' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, sibling) => sibling?.type === 'page',
          },
        },
        {
          name: 'anchorId',
          type: 'text',
          label: 'Anchor ID',
          admin: {
            description: 'CSS ID of the target element on the page, without the # symbol.',
            condition: (_, sibling) => sibling?.type === 'scroll',
          },
        },
        {
          name: 'videoUrl',
          type: 'upload',
          relationTo: 'media',
          label: 'Video',
          admin: {
            condition: (_, sibling) => sibling?.type === 'video',
          },
        },
      ],
    },
  ]),
}
