import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const CardList: Block = {
  slug: 'cardList',
  labels: { singular: 'Illustration Card List', plural: 'Illustration Card Lists' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'illustration',
          type: 'select',
          required: true,
          admin: {
            description: 'Predefined illustration — update options once illustrations are finalised.',
          },
          options: [
            { label: 'Illustration 1', value: 'illustration-1' },
            { label: 'Illustration 2', value: 'illustration-2' },
            { label: 'Illustration 3', value: 'illustration-3' },
            { label: 'Illustration 4', value: 'illustration-4' },
            { label: 'Illustration 5', value: 'illustration-5' },
            { label: 'Illustration 6', value: 'illustration-6' },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'richText',
        },
      ],
    },
    {
      name: 'button',
      type: 'group',
      admin: {
        description: 'Optional button below the cards. Leave label empty to hide.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ]),
}
