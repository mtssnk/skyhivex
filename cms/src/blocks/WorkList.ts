import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const WorkList: Block = {
  slug: 'workList',
  labels: { singular: 'Work List', plural: 'Work Lists' },
  fields: withBlockTabs([
    {
      name: 'heading',
      type: 'text',
      required: false,
    },
    {
      name: 'works',
      type: 'relationship',
      relationTo: 'work',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 3,
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      defaultValue: 'View all work',
      admin: {
        description: 'Label for the link to /work.',
      },
    },
  ]),
}
