import type { CollectionConfig } from 'payload'
import { overlayAlphaField } from '../fields/overlayAlpha'
import { postBlocks } from '../blocks'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'updatedAt'],
    preview: (doc) => {
      const slug = doc?.slug as string | undefined
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/preview?secret=${secret}&slug=news/${slug ?? ''}&collection=posts`
    },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title. Do not change after publishing.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.title || ''
            return source
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          },
        ],
      },
      validate: async (
        value: string | string[] | null | undefined,
        { req, id }: { req: any; id?: string | number },
      ) => {
        if (!value || Array.isArray(value)) return true
        const existing = await req.payload.find({
          collection: 'posts',
          where: { slug: { equals: value }, ...(id ? { id: { not_equals: id } } : {}) },
          limit: 1,
          depth: 0,
        })
        if (existing.totalDocs > 0) return 'A post with this slug already exists.'
        return true
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on listing cards. Falls back to meta description for SEO.',
      },
    },
    {
      name: 'listingImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image shown on the news index card and at the top of the post.',
      },
    },
    overlayAlphaField({ defaultValue: 0.4 }),
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      blocks: postBlocks,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'SEO meta description (max 160 characters).',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description:
          'Social share image (OG). Recommended: 1200×630px. Falls back to listing image.',
      },
    },
    {
      type: 'collapsible',
      label: 'Geographic categories',
      admin: {
        position: 'sidebar',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'regions',
          type: 'relationship',
          relationTo: 'regions',
          hasMany: true,
        },
        {
          name: 'states',
          type: 'relationship',
          relationTo: 'states',
          hasMany: true,
        },
        {
          name: 'cities',
          type: 'relationship',
          relationTo: 'cities',
          hasMany: true,
        },
      ],
    },
  ],
}
