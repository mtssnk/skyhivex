import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const Media: Block = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media Blocks' },
  fields: withBlockTabs([
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
  ]),
}
