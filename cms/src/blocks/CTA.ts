import type { Block } from 'payload'
import { headingStyleOptions, withBlockTabs } from './fields/blockFields'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: withBlockTabs([
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlayAlpha',
      type: 'number',
      min: 0,
      max: 1,
      admin: {
        description: 'Dark overlay opacity (0–1) to improve text contrast.',
        step: 0.05,
      },
    },
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'textStyle',
      type: 'select',
      required: true,
      defaultValue: 'text-extended-lg',
      options: headingStyleOptions,
    },
    {
      name: 'button',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ]),
}
