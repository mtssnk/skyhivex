import type { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { MediaText } from '../blocks/MediaText'
import { Media } from '../blocks/Media'
import { Quote } from '../blocks/Quote'
import { BodyCopy } from '../blocks/BodyCopy'
import { CTA } from '../blocks/CTA'
import { PersonList } from '../blocks/PersonList'
import { AccordionList } from '../blocks/AccordionList'
import { CardList } from '../blocks/CardList'
import { ProjectList } from '../blocks/ProjectList'
import { NewsCardList } from '../blocks/NewsCardList'
import { LogoList } from '../blocks/LogoList'

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
      name: 'listingImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image shown on the news index card and at the top of the post.',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      blocks: [
        MediaText,
        Media,
        Quote,
        BodyCopy,
        CTA,
        PersonList,
        AccordionList,
        CardList,
        ProjectList,
        NewsCardList,
        LogoList,
      ],
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
        description: 'Social share image (OG). Recommended: 1200×630px. Falls back to listing image.',
      },
    },
  ],
}
