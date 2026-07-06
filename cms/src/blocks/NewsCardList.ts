import type { Block } from 'payload'
import { withBlockTabs } from './fields/blockFields'

export const NewsCardList: Block = {
  slug: 'newsCardList',
  labels: { singular: 'News Card List', plural: 'News Card Lists' },
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
        description: 'Filter articles by region.',
        condition: (_, sibling) => sibling?.selectionMode === 'by-geography',
      },
    },
    {
      name: 'filterState',
      type: 'relationship',
      relationTo: 'states',
      admin: {
        description: 'Filter articles by state.',
        condition: (_, sibling) => sibling?.selectionMode === 'by-geography',
      },
    },
    {
      name: 'filterCity',
      type: 'relationship',
      relationTo: 'cities',
      admin: {
        description: 'Filter articles by city.',
        condition: (_, sibling) => sibling?.selectionMode === 'by-geography',
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
