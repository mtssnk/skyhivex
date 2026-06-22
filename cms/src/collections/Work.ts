import type { CollectionConfig } from 'payload'
import { MediaText } from '../blocks/MediaText'
import { Media } from '../blocks/Media'
import { Quote } from '../blocks/Quote'

export const Work: CollectionConfig = {
  slug: 'work',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['listingMedia', 'client', 'projectName', 'updatedAt'],
    preview: (doc) => {
      const slug = doc?.slug as string | undefined
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/preview?secret=${secret}&slug=work/${slug ?? ''}&collection=work`
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
      name: 'isDark',
      type: 'checkbox',
      label: 'Dark Mode',
      defaultValue: true,
      admin: {
        description: 'Enable dark mode for this work page.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'projectName',
      type: 'text',
      required: true,
      admin: {
        description: 'Public-facing project name. Used on listing cards and in structured data.',
      },
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
            const source = value || data?.projectName || ''
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
          collection: 'work',
          where: { slug: { equals: value }, ...(id ? { id: { not_equals: id } } : {}) },
          limit: 1,
          depth: 0,
        })
        if (existing.totalDocs > 0) return 'A case study with this slug already exists.'
        return true
      },
    },
    {
      name: 'listingMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image or video shown on the work listing card.',
      },
    },
    {
      name: 'heroMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero media on the detail page. Falls back to listing media if not set.',
      },
    },
    {
      name: 'services',
      type: 'array',
      fields: [
        {
          name: 'service',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Live URL',
      admin: {
        description: 'Optional link to the live project.',
      },
    },
    {
      name: 'body',
      type: 'blocks',
      blocks: [MediaText, Media, Quote],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pin this entry to the homepage WorkList block.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'SEO meta description (max 160 characters). Defaults to "Client — Title".',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description:
          'Social share image (OG). Recommended: 1200×630px. Falls back to hero/listing media.',
      },
    },
  ],
}
