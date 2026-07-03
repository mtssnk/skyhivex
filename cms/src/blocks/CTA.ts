import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'
import { overlayAlphaField } from '../fields/overlayAlpha'

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
    overlayAlphaField(),
    {
      name: 'text',
      type: 'text',
      required: true,
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
