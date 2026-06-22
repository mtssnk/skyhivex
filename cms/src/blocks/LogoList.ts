import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const LogoList: Block = {
  slug: 'logoList',
  labels: { singular: 'Logo List', plural: 'Logo Lists' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'logos',
      type: 'relationship',
      relationTo: 'svgs',
      hasMany: true,
      required: true,
    },
  ]),
}
