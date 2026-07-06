import type { CollectionConfig } from 'payload'
import { Hero } from '../blocks/Hero'
import { MediaText } from '../blocks/MediaText'
import { overlayAlphaField } from '../fields/overlayAlpha'
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
import { LinkedContent } from '../blocks/LinkedContent'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'heading',
    defaultColumns: ['heading', 'clientTypes', 'updatedAt'],
    preview: (doc) => {
      const slug = doc?.slug as string | undefined
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/preview?secret=${secret}&slug=projects/${slug ?? ''}&collection=projects`
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
      name: 'heading',
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
            const source = value || data?.heading || ''
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
          collection: 'projects',
          where: { slug: { equals: value }, ...(id ? { id: { not_equals: id } } : {}) },
          limit: 1,
          depth: 0,
        })
        if (existing.totalDocs > 0) return 'A project with this slug already exists.'
        return true
      },
    },
    {
      name: 'clientType',
      type: 'relationship',
      relationTo: 'client-types',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      type: 'relationship',
      relationTo: 'states',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      hasMany: false,
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
        description:
          'Image shown on the projects index card. Used as hero background if no hero media is set.',
      },
    },
    {
      name: 'heroMedia',
      type: 'group',
      admin: {
        description: 'Overrides the listing image as the hero background.',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, sibling) => sibling?.type === 'image',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Muted, looped, autoplayed as background.',
            condition: (_, sibling) => sibling?.type === 'video',
          },
        },
        overlayAlphaField(),
      ],
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Displayed before the project summary section.',
      },
    },
    {
      name: 'summary',
      type: 'array',
      admin: {
        description: 'Key details displayed in the project summary section.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Additional content',
      admin: {
        description: 'Appended after the summary section.',
      },
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
        description:
          'Social share image (OG). Recommended: 1200×630px. Falls back to listing image.',
      },
    },
  ],
}
