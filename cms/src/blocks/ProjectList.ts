import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const ProjectList: Block = {
  slug: 'projectList',
  labels: { singular: 'Project List', plural: 'Project Lists' },
  fields: withBlockTabs([
    {
      name: 'selectionMode',
      type: 'select',
      required: true,
      defaultValue: 'latest',
      options: [
        { label: 'Manual selection', value: 'manual' },
        { label: 'By category', value: 'category' },
        { label: 'Latest', value: 'latest' },
      ],
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: 'Pick specific projects to display.',
        condition: (_, sibling) => sibling?.selectionMode === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (_, sibling) => sibling?.selectionMode === 'category',
      },
    },
    {
      name: 'count',
      type: 'number',
      min: 1,
      admin: {
        description: 'Number of projects to display.',
        condition: (_, sibling) =>
          sibling?.selectionMode === 'category' || sibling?.selectionMode === 'latest',
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      admin: {
        description: 'Label for the link to the projects index. Leave empty to hide.',
      },
    },
  ]),
}
