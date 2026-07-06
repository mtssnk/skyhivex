import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const ProjectList: Block = {
  slug: 'projectList',
  labels: { singular: 'Project List', plural: 'Project Lists' },
  fields: withBlockTabs(
    [
      {
        name: 'selectionMode',
        type: 'select',
        required: true,
        defaultValue: 'latest',
        options: [
          { label: 'Manual selection', value: 'manual' },
          { label: 'Filtered', value: 'filtered' },
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
        name: 'filterClientType',
        type: 'relationship',
        relationTo: 'client-types',
        admin: {
          description: 'Filter by client type.',
          condition: (_, sibling) => sibling?.selectionMode === 'filtered',
        },
      },
      {
        name: 'filterRegion',
        type: 'relationship',
        relationTo: 'regions',
        admin: {
          description: 'Filter by region.',
          condition: (_, sibling) => sibling?.selectionMode === 'filtered',
        },
      },
      {
        name: 'filterState',
        type: 'relationship',
        relationTo: 'states',
        admin: {
          description: 'Filter by state.',
          condition: (_, sibling) => sibling?.selectionMode === 'filtered',
        },
      },
      {
        name: 'filterCity',
        type: 'relationship',
        relationTo: 'cities',
        admin: {
          description: 'Filter by city.',
          condition: (_, sibling) => sibling?.selectionMode === 'filtered',
        },
      },
      {
        name: 'count',
        type: 'number',
        min: 1,
        admin: {
          description: 'Number of projects to display.',
          condition: (_, sibling) =>
            sibling?.selectionMode === 'filtered' || sibling?.selectionMode === 'latest',
        },
      },
      {
        name: 'heading',
        type: 'text',
      },
      {
        name: 'viewAllLabel',
        type: 'text',
        admin: {
          description: 'Label for the link to the projects index. Leave empty to hide.',
        },
      },
    ],
    { padding: false },
  ),
}
