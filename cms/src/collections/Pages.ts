import type { CollectionConfig } from 'payload'
import { pageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => {
      const slug = doc?.slug as string | undefined
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/preview?secret=${secret}&slug=${slug ?? ''}&collection=pages`
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
        description:
          'URL segment for this page. Use "home" for the homepage (/). If a parent page is selected, this is automatically combined with the parent\'s full path (e.g. parent "services", typing "web-design" here → "services/web-design"). Do not change after publishing.',
      },
      hooks: {
        beforeValidate: [
          async ({ value, data, originalDoc, req }) => {
            const source = value || data?.title || originalDoc?.title || ''
            const ownSegment =
              source
                .toLowerCase()
                .replace(/[^a-z0-9/]+/g, '-')
                .replace(/(^[-/]|[-/]$)/g, '')
                .replace(/\/+/g, '/')
                .split('/')
                .pop() ?? ''

            const rawParent = data?.parent !== undefined ? data.parent : originalDoc?.parent
            const parentId =
              rawParent && typeof rawParent === 'object' ? rawParent.id : rawParent

            if (!parentId || parentId === originalDoc?.id) return ownSegment

            const parent = await req.payload.findByID({
              collection: 'pages',
              id: parentId,
              depth: 0,
            })

            return parent?.slug ? `${parent.slug}/${ownSegment}` : ownSegment
          },
        ],
      },
      validate: async (
        value: string | string[] | null | undefined,
        { req, id }: { req: any; id?: string | number },
      ) => {
        if (!value || Array.isArray(value)) return true
        const existing = await req.payload.find({
          collection: 'pages',
          where: { slug: { equals: value }, ...(id ? { id: { not_equals: id } } : {}) },
          limit: 1,
          depth: 0,
        })
        if (existing.totalDocs > 0) return 'A page with this slug already exists.'
        return true
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description:
          "Selecting a parent automatically prefixes this page's slug with the parent's full path.",
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBlocks,
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
        description: 'Social share image (OG). Recommended: 1200×630px.',
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
