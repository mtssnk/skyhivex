import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const BodyCopy: Block = {
  slug: 'bodyCopy',
  labels: { singular: 'Body Copy', plural: 'Body Copy Blocks' },
  imageURL: '/assets/block-thumbnails/body-copy-preview.jpg',
  fields: withBlockTabs([
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ]),
}
