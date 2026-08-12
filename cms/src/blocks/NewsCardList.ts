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
    sibling?.selectionMode === 'by-geography' && (activeGeoField(sibling) ?? field) === field

export const NewsCardList: Block = {
  slug: 'newsCardList',
  labels: { singular: 'News Card List', plural: 'News Card Lists' },
  imageURL: '/assets/block-thumbnails/news-card-list-preview.jpg',
  fields: withBlockTabs([
    {
      name: 'selectionMode',
      type: 'select',
      required: true,
      defaultValue: 'latest',
      options: [
        { label: 'Manual selection', value: 'manual' },
        { label: 'By post category', value: 'category' },
        { label: 'By geography', value: 'by-geography' },
        { label: 'Latest', value: 'latest' },
      ],
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'Pick up to three articles.',
        condition: (_, sibling) => sibling?.selectionMode === 'manual',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Shows the latest three articles in this category.',
        condition: (_, sibling) => sibling?.selectionMode === 'category',
      },
    },
    {
      name: 'filterRegion',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        description: 'Filter articles by region. Selecting a region hides state/city — clear it to filter by those instead.',
        condition: geoCondition('filterRegion'),
      },
    },
    {
      name: 'filterState',
      type: 'relationship',
      relationTo: 'states',
      admin: {
        description: 'Filter articles by state. Selecting a state hides region/city — clear it to filter by those instead.',
        condition: geoCondition('filterState'),
      },
    },
    {
      name: 'filterCity',
      type: 'relationship',
      relationTo: 'cities',
      admin: {
        description: 'Filter articles by city. Selecting a city hides region/state — clear it to filter by those instead.',
        condition: geoCondition('filterCity'),
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      admin: {
        description: 'Label for the link to the news index. Leave empty to hide.',
      },
    },
  ]),
}
