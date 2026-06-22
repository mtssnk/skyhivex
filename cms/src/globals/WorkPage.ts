import type { GlobalConfig } from 'payload'
import { LogoList } from '../blocks/LogoList'
import { CardList } from '../blocks/CardList'
import { ContactForm } from '../blocks/ContactForm'
import { MediaText } from '../blocks/MediaText'
import { Media } from '../blocks/Media'
import { Quote } from '../blocks/Quote'

export const WorkPage: GlobalConfig = {
  slug: 'work-page',
  label: 'Case study listing',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro',
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Blocks (after work list)',
      blocks: [LogoList, CardList, ContactForm, MediaText, Media, Quote],
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
  ],
}
