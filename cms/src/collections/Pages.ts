import type { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { LogoList } from '../blocks/LogoList'
import { MediaText } from '../blocks/MediaText'
import { Media } from '../blocks/Media'
import { CardList } from '../blocks/CardList'
import { Quote } from '../blocks/Quote'
import { BodyCopy } from '../blocks/BodyCopy'
import { CTA } from '../blocks/CTA'
import { PersonList } from '../blocks/PersonList'
import { AccordionList } from '../blocks/AccordionList'
import { ProjectList } from '../blocks/ProjectList'
import { NewsCardList } from '../blocks/NewsCardList'
import { FeatureList } from '../blocks/FeatureList'
import { LinkedContent } from '../blocks/LinkedContent'

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
          'Full URL path for this page. Use "home" for the homepage (/). For nested pages include the full path, e.g. "services/northeast/texas". Do not change after publishing.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.title || ''
            return source
              .toLowerCase()
              .replace(/[^a-z0-9/]+/g, '-')
              .replace(/(^[-/]|[-/]$)/g, '')
              .replace(/\/+/g, '/')
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
        description: 'Parent page for hierarchical navigation. The slug must include the parent path.',
      },
    },
    {
      name: 'isDark',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If enabled, the header will use the dark variant with white text.',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        Hero,
        LogoList,
        MediaText,
        Media,
        CardList,
        Quote,
        BodyCopy,
        CTA,
        PersonList,
        AccordionList,
        ProjectList,
        NewsCardList,
        FeatureList,
        LinkedContent,
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
