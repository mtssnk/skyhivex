import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

const geoFields = ['filterRegion', 'filterState', 'filterCity'] as const

// Of the three geography filters, the first one (in priority order) that has
// a value "wins" and is shown; the others stay hidden. This keeps selection
// mutually exclusive in both directions without any field being able to hide
// itself — so a block that somehow has more than one saved (e.g. from before
// this mutual-exclusion rule existed) always has exactly one visible field to
// clear, rather than deadlocking with all three hidden.
const activeGeoField = (sibling: Record<string, unknown> | undefined | null) =>
  geoFields.find((field) => Boolean(sibling?.[field])) ?? null

const geoCondition =
  (field: (typeof geoFields)[number]) => (_: unknown, sibling: Record<string, unknown>) =>
    sibling?.selectionMode === 'geography' && (activeGeoField(sibling) ?? field) === field

export const ProjectList: Block = {
  slug: 'projectList',
  labels: { singular: 'Project List', plural: 'Project Lists' },
  imageURL: '/assets/block-thumbnails/project-list-preview.jpg',
  fields: withBlockTabs(
    [
      {
        name: 'selectionMode',
        type: 'select',
        required: true,
        defaultValue: 'latest',
        options: [
          { label: 'Manual selection', value: 'manual' },
          { label: 'By client type', value: 'clientType' },
          { label: 'By geography', value: 'geography' },
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
          condition: (_, sibling) => sibling?.selectionMode === 'clientType',
        },
      },
      {
        name: 'filterRegion',
        type: 'relationship',
        relationTo: 'regions',
        admin: {
          description: 'Filter by region. Selecting a region hides state/city — clear it to filter by those instead.',
          condition: geoCondition('filterRegion'),
        },
      },
      {
        name: 'filterState',
        type: 'relationship',
        relationTo: 'states',
        admin: {
          description: 'Filter by state. Selecting a state hides region/city — clear it to filter by those instead.',
          condition: geoCondition('filterState'),
        },
      },
      {
        name: 'filterCity',
        type: 'relationship',
        relationTo: 'cities',
        admin: {
          description: 'Filter by city. Selecting a city hides region/state — clear it to filter by those instead.',
          condition: geoCondition('filterCity'),
        },
      },
      {
        name: 'count',
        type: 'number',
        min: 1,
        admin: {
          description: 'Number of projects to display.',
          condition: (_, sibling) =>
            sibling?.selectionMode === 'clientType' ||
            sibling?.selectionMode === 'geography' ||
            sibling?.selectionMode === 'latest',
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
